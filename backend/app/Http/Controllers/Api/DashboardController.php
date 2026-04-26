<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\Lesson;
use App\Models\QuizQuestionAttempt;
use App\Models\UserLessonProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $user = request()->user();

        if (!$user) {
            return response()->json(['message' => 'Authentication required for progress tracking.'], 401);
        }

        try {
            $data = Cache::remember("dashboard:user:{$user->id}", 180, function () use ($user) {
                return $this->buildDashboard($user);
            });
        } catch (\Exception $e) {
            $data = $this->buildDashboard($user);
        }

        return response()->json($data);
    }

    private function buildDashboard($user): array
    {
        $countries = Country::query()
            ->where('is_active', true)
            ->with([
                'modules' => fn($q) => $q
                    ->where('is_active', true)
                    ->with([
                        'lessons' => fn($lq) => $lq
                            ->where('is_active', true)
                            ->orderBy('order'),
                    ])
                    ->orderBy('order'),
            ])
            ->orderBy('name')
            ->get();

        $lessonProgressRows = UserLessonProgress::where('user_id', $user->id)
            ->get()
            ->keyBy('lesson_id');

        $activeCountries = $countries->map(function (Country $country) use ($lessonProgressRows) {
            $lessons = $country->modules->flatMap(fn($m) => $m->lessons)->values();
            $totalLessons = $lessons->count();

            $completedLessons = $lessons->filter(
                fn($l) => $lessonProgressRows->get($l->id)?->status === 'completed'
            );
            $startedLessons = $lessons->filter(
                fn($l) => in_array($lessonProgressRows->get($l->id)?->status, ['in_progress', 'completed'], true)
            );

            $progressPct = $totalLessons > 0
                ? (int) floor(($completedLessons->count() / $totalLessons) * 100)
                : 0;

            $status = match (true) {
                $progressPct >= 100 && $totalLessons > 0 => 'completed',
                $startedLessons->isNotEmpty() => 'in_progress',
                default => 'not_started',
            };

            $lastLessonTitle = match ($status) {
                'completed' => $completedLessons->last()?->title ?? $lessons->last()?->title,
                'in_progress' => $startedLessons->last()?->title ?? $lessons->first()?->title,
                default => $lessons->first()?->title,
            };

            return [
                'countryId'       => $country->slug,
                'countryName'     => $country->name,
                'region'          => $country->region,
                'status'          => $status,
                'progressPct'     => $progressPct,
                'teaser'          => str($country->description ?? '')->limit(90)->toString(),
                'lastLessonTitle' => $lastLessonTitle,
                'flagPath'        => $country->flag_path,
                'flagUrl'         => $country->flag_path ? Storage::disk('public')->url($country->flag_path) : null,
                'flagEmoji'       => $country->flagEmoji(),
            ];
        })->values();

        // XP / level
        $xp = (int) UserLessonProgress::where('user_id', $user->id)->sum('xp_earned');
        $level = intdiv($xp, 100) + 1;
        $xpToNextLevel = 100 - ($xp % 100) ?: 100;

        // Lessons completed %
        $totalActiveLessons = Lesson::where('is_active', true)->count();
        $completedLessonCount = UserLessonProgress::where('user_id', $user->id)
            ->where('status', 'completed')
            ->count();
        $lessonsCompletedPct = $totalActiveLessons > 0
            ? (int) floor(($completedLessonCount / $totalActiveLessons) * 100)
            : 0;

        // Quiz accuracy — 2 queries instead of 2 clones
        $quizAgg = QuizQuestionAttempt::where('user_id', $user->id)
            ->selectRaw('COUNT(*) as total, SUM(is_correct) as correct')
            ->first();
        $quizAccuracyPct = $quizAgg->total > 0
            ? (int) floor($quizAgg->correct / $quizAgg->total * 100)
            : 0;

        $todayStart = now()->startOfDay();
        $weekStart  = now()->startOfWeek();

        // Time breakdown — 4 queries (one per table) instead of 12
        $tables = [
            ['table' => 'scenario_attempts',        'label' => 'scenario'],
            ['table' => 'quiz_question_attempts',   'label' => 'quiz'],
            ['table' => 'flashcard_reviews',        'label' => 'flashcard'],
            ['table' => 'lesson_completion_events', 'label' => 'lesson'],
        ];

        $times = [];
        foreach ($tables as ['table' => $table, 'label' => $label]) {
            $row = DB::table($table)
                ->where('user_id', $user->id)
                ->selectRaw(
                    'SUM(duration_seconds) as total,
                     SUM(CASE WHEN created_at >= ? THEN duration_seconds ELSE 0 END) as week,
                     SUM(CASE WHEN created_at >= ? THEN duration_seconds ELSE 0 END) as today',
                    [$weekStart, $todayStart]
                )
                ->first();

            $times[$label] = [
                'total' => (int) ($row->total ?? 0),
                'week'  => (int) ($row->week ?? 0),
                'today' => (int) ($row->today ?? 0),
            ];
        }

        $timeSpentTodaySeconds = array_sum(array_column($times, 'today'));
        $timeSpentWeekSeconds  = array_sum(array_column($times, 'week'));
        $timeSpentTotalSeconds = array_sum(array_column($times, 'total'));

        // Week progress — 1 query instead of 7 exists() calls
        $activeDates = DB::table('lesson_completion_events')
            ->where('user_id', $user->id)
            ->where('created_at', '>=', $weekStart)
            ->selectRaw('DATE(created_at) as day')
            ->distinct()
            ->pluck('day')
            ->toArray();

        $weekProgress = collect(range(0, 6))
            ->map(fn(int $offset) => in_array(
                $weekStart->copy()->addDays($offset)->toDateString(),
                $activeDates
            ))
            ->values()
            ->all();

        return [
            'user' => [
                'xp'                  => $xp,
                'level'               => $level,
                'xpToNextLevel'       => $xpToNextLevel,
                'streakDays'          => (int) ($user->current_streak ?? 0),
                'longestStreak'       => (int) ($user->longest_streak ?? 0),
                'isCompletedToday'    => $user->last_activity_date === now()->toDateString(),
                'accuracy'            => $quizAccuracyPct,
                'lessonsCompletedPct' => $lessonsCompletedPct,
                'timeTodayMinutes'    => (int) floor($timeSpentTodaySeconds / 60),
                'timeWeekMinutes'     => (int) floor($timeSpentWeekSeconds / 60),
                'timeTotalMinutes'    => (int) floor($timeSpentTotalSeconds / 60),
                'weekProgress'        => $weekProgress,
            ],
            'activeCountries' => $activeCountries,
        ];
    }
}
