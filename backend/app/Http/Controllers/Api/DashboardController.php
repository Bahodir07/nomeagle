<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\FlashcardReview;
use App\Models\Lesson;
use App\Models\LessonCompletionEvent;
use App\Models\QuizQuestionAttempt;
use App\Models\ScenarioAttempt;
use App\Models\User;
use App\Models\UserLessonProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $user = request()->user() ?? User::first();

        if (! $user) {
            return response()->json([
                'message' => 'Authentication required for dashboard.',
            ], 401);
        }

        $countries = Country::query()
            ->where('is_active', true)
            ->with([
                'modules' => fn ($query) => $query
                    ->where('is_active', true)
                    ->with([
                        'lessons' => fn ($lessonQuery) => $lessonQuery->where('is_active', true),
                    ]),
            ])
            ->orderBy('name')
            ->get();

        $lessonProgressRows = UserLessonProgress::query()
            ->where('user_id', $user->id)
            ->get()
            ->keyBy('lesson_id');

        $learningCountries = $countries->map(function (Country $country) use ($lessonProgressRows) {
            $lessons = $country->modules
                ->flatMap(fn ($module) => $module->lessons)
                ->values();

            $totalLessons = $lessons->count();

            $completedLessons = $lessons->filter(function ($lesson) use ($lessonProgressRows) {
                $progress = $lessonProgressRows->get($lesson->id);

                return $progress && $progress->status === 'completed';
            })->count();

            $startedLessons = $lessons->filter(function ($lesson) use ($lessonProgressRows) {
                $progress = $lessonProgressRows->get($lesson->id);

                return $progress && in_array($progress->status, ['in_progress', 'completed'], true);
            })->count();

            $progressPct = $totalLessons > 0
                ? (int) floor(($completedLessons / $totalLessons) * 100)
                : 0;

            $status = match (true) {
                $progressPct >= 100 && $totalLessons > 0 => 'completed',
                $startedLessons > 0 => 'in_progress',
                default => 'not_started',
            };

            $action = match ($status) {
                'completed' => 'review',
                'in_progress' => 'continue',
                default => 'start',
            };

            return [
                'country_id' => $country->id,
                'name' => $country->name,
                'slug' => $country->slug,
                'flag_url' => $country->flag_path
                    ? Storage::disk('public')->url($country->flag_path)
                    : null,
                'description' => str($country->description ?? '')->limit(80)->toString(),
                'status' => $status,
                'progress_pct' => $progressPct,
                'total_lessons' => $totalLessons,
                'completed_lessons' => $completedLessons,
                'action' => $action,
            ];
        });

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
            'learning_countries' => $learningCountries->values(),
            'stats' => [
                'quiz_accuracy_pct' => $quizAccuracyPct,
                'lessons_completed_pct' => $lessonsCompletedPct,
                'time_spent_today_seconds' => $timeSpentTodaySeconds,
                'time_spent_week_seconds' => $timeSpentWeekSeconds,
                'time_spent_total_seconds' => $timeSpentTotalSeconds,
            ],
        ]);
    }
}
