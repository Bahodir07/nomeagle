<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\FlashcardReview;
use App\Models\Lesson;
use App\Models\LessonCompletionEvent;
use App\Models\QuizQuestionAttempt;
use App\Models\ScenarioAttempt;
use App\Models\UserLessonProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $user = request()->user();

        if (! $user) {
            return response()->json([
                'message' => 'Authentication required for progress tracking.',
            ], 401);
        }

        $countries = Country::query()
            ->where('is_active', true)
            ->with([
                'modules' => fn ($query) => $query
                    ->where('is_active', true)
                    ->with([
                        'lessons' => fn ($lessonQuery) => $lessonQuery
                            ->where('is_active', true)
                            ->orderBy('order'),
                    ])
                    ->orderBy('order'),
            ])
            ->orderBy('name')
            ->get();

        $lessonProgressRows = UserLessonProgress::query()
            ->where('user_id', $user->id)
            ->get()
            ->keyBy('lesson_id');

        $activeCountries = $countries->map(function (Country $country) use ($lessonProgressRows) {
            $lessons = $country->modules
                ->flatMap(fn ($module) => $module->lessons)
                ->values();

            $totalLessons = $lessons->count();

            $completedLessons = $lessons->filter(function ($lesson) use ($lessonProgressRows) {
                $progress = $lessonProgressRows->get($lesson->id);

                return $progress && $progress->status === 'completed';
            });

            $startedLessons = $lessons->filter(function ($lesson) use ($lessonProgressRows) {
                $progress = $lessonProgressRows->get($lesson->id);

                return $progress && in_array($progress->status, ['in_progress', 'completed'], true);
            });

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

            $flagUrl = $country->flag_path
                ? Storage::url($country->flag_path)
                : null;

            return [
                'countryId' => $country->slug,
                'countryName' => $country->name,
                'region' => $country->region,
                'status' => $status,
                'progressPct' => $progressPct,
                'teaser' => str($country->description ?? '')->limit(90)->toString(),
                'lastLessonTitle' => $lastLessonTitle,
                'flagPath' => $country->flag_path,
                'flagUrl' => $flagUrl,
                'flagEmoji' => $this->getFlagEmoji($country->slug),
            ];
        })->values();

        $xp = UserLessonProgress::query()
            ->where('user_id', $user->id)
            ->sum('xp_earned');

        $level = intdiv($xp, 100) + 1;
        $xpToNextLevel = 100 - ($xp % 100);
        $xpToNextLevel = $xpToNextLevel === 0 ? 100 : $xpToNextLevel;

        $totalActiveLessons = Lesson::query()
            ->where('is_active', true)
            ->count();

        $completedLessonCount = UserLessonProgress::query()
            ->where('user_id', $user->id)
            ->where('status', 'completed')
            ->count();

        $lessonsCompletedPct = $totalActiveLessons > 0
            ? (int) floor(($completedLessonCount / $totalActiveLessons) * 100)
            : 0;

        $quizAttempts = QuizQuestionAttempt::query()
            ->where('user_id', $user->id);

        $quizTotalAttempts = (clone $quizAttempts)->count();

        $quizCorrectAttempts = (clone $quizAttempts)
            ->where('is_correct', true)
            ->count();

        $quizAccuracyPct = $quizTotalAttempts > 0
            ? (int) floor(($quizCorrectAttempts / $quizTotalAttempts) * 100)
            : 0;

        $todayStart = now()->startOfDay();
        $weekStart = now()->startOfWeek();

        $scenarioTimeToday = ScenarioAttempt::query()
            ->where('user_id', $user->id)
            ->where('created_at', '>=', $todayStart)
            ->sum('duration_seconds');

        $quizTimeToday = QuizQuestionAttempt::query()
            ->where('user_id', $user->id)
            ->where('created_at', '>=', $todayStart)
            ->sum('duration_seconds');

        $flashcardTimeToday = FlashcardReview::query()
            ->where('user_id', $user->id)
            ->where('created_at', '>=', $todayStart)
            ->sum('duration_seconds');

        $lessonTimeToday = LessonCompletionEvent::query()
            ->where('user_id', $user->id)
            ->where('created_at', '>=', $todayStart)
            ->sum('duration_seconds');

        $scenarioTimeWeek = ScenarioAttempt::query()
            ->where('user_id', $user->id)
            ->where('created_at', '>=', $weekStart)
            ->sum('duration_seconds');

        $quizTimeWeek = QuizQuestionAttempt::query()
            ->where('user_id', $user->id)
            ->where('created_at', '>=', $weekStart)
            ->sum('duration_seconds');

        $flashcardTimeWeek = FlashcardReview::query()
            ->where('user_id', $user->id)
            ->where('created_at', '>=', $weekStart)
            ->sum('duration_seconds');

        $lessonTimeWeek = LessonCompletionEvent::query()
            ->where('user_id', $user->id)
            ->where('created_at', '>=', $weekStart)
            ->sum('duration_seconds');

        $scenarioTimeTotal = ScenarioAttempt::query()
            ->where('user_id', $user->id)
            ->sum('duration_seconds');

        $quizTimeTotal = QuizQuestionAttempt::query()
            ->where('user_id', $user->id)
            ->sum('duration_seconds');

        $flashcardTimeTotal = FlashcardReview::query()
            ->where('user_id', $user->id)
            ->sum('duration_seconds');

        $lessonTimeTotal = LessonCompletionEvent::query()
            ->where('user_id', $user->id)
            ->sum('duration_seconds');

        $timeSpentTodaySeconds = $scenarioTimeToday + $quizTimeToday + $flashcardTimeToday + $lessonTimeToday;
        $timeSpentWeekSeconds = $scenarioTimeWeek + $quizTimeWeek + $flashcardTimeWeek + $lessonTimeWeek;
        $timeSpentTotalSeconds = $scenarioTimeTotal + $quizTimeTotal + $flashcardTimeTotal + $lessonTimeTotal;

        return response()->json([
            'user' => [
                'xp' => $xp,
                'level' => $level,
                'xpToNextLevel' => $xpToNextLevel,
                'streakDays' => 0,
                'accuracy' => $quizAccuracyPct,
                'lessonsCompletedPct' => $lessonsCompletedPct,
                'timeTodayMinutes' => (int) floor($timeSpentTodaySeconds / 60),
                'timeWeekMinutes' => (int) floor($timeSpentWeekSeconds / 60),
                'timeTotalMinutes' => (int) floor($timeSpentTotalSeconds / 60),
            ],
            'activeCountries' => $activeCountries,
        ]);
    }

    private function getFlagEmoji(string $slug): string
    {
        return match ($slug) {
            'japan' => '🇯🇵',
            'germany' => '🇩🇪',
            'kazakhstan' => '🇰🇿',
            'france' => '🇫🇷',
            'italy' => '🇮🇹',
            'brazil' => '🇧🇷',
            'usa', 'united-states' => '🇺🇸',
            'china' => '🇨🇳',
            'turkey' => '🇹🇷',
            'south-korea', 'korea' => '🇰🇷',
            default => '🏳️',
        };
    }
}
