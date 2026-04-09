<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\QuizQuestionResource;
use App\Models\Country;
use App\Models\QuizQuestion;
use App\Models\QuizQuestionAttempt;
use App\Models\User;
use App\Models\UserLessonProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class QuizQuestionController extends Controller
{
    public function index(Country $country, string $module, string $lesson): AnonymousResourceCollection
    {
        abort_unless($country->is_active, 404);

        $moduleRecord = $country->modules()
            ->where('slug', $module)
            ->where('is_active', true)
            ->firstOrFail();

        $lessonRecord = $moduleRecord->lessons()
            ->where('slug', $lesson)
            ->where('is_active', true)
            ->firstOrFail();

        $questions = $lessonRecord->quizQuestions()
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        return QuizQuestionResource::collection($questions);
    }

    public function show(Country $country, string $module, string $lesson, QuizQuestion $quizQuestion): QuizQuestionResource
    {
        abort_unless($country->is_active, 404);

        $moduleRecord = $country->modules()
            ->where('slug', $module)
            ->where('is_active', true)
            ->firstOrFail();

        $lessonRecord = $moduleRecord->lessons()
            ->where('slug', $lesson)
            ->where('is_active', true)
            ->firstOrFail();

        abort_unless($quizQuestion->lesson_id === $lessonRecord->id, 404);
        abort_unless($quizQuestion->is_active, 404);

        return new QuizQuestionResource($quizQuestion);
    }

    public function submit(Request $request, QuizQuestion $quizQuestion): JsonResponse
    {
        abort_unless($quizQuestion->is_active, 404);

        // Временный dev-вариант, пока нет полноценной auth:
        $user = $request->user() ?? User::first();

        if (! $user) {
            return response()->json([
                'message' => 'Authentication required for progress tracking.',
            ], 401);
        }

        $request->validate([
            'answer' => ['required', 'string'],
            'duration_seconds' => ['nullable', 'integer', 'min:0'],
        ]);

        $options = $quizQuestion->options;

        if (! is_array($options)) {
            return response()->json([
                'error' => 'Invalid quiz question options',
            ], 500);
        }

        $selected = collect($options)->firstWhere('id', $request->input('answer'));

        if (! $selected) {
            return response()->json([
                'error' => 'Invalid answer',
            ], 422);
        }

        $isCorrect = (bool) ($selected['is_correct'] ?? false);
        $lesson = $quizQuestion->lesson;
        $durationSeconds = (int) $request->input('duration_seconds', 0);

        $result = DB::transaction(function () use ($user, $quizQuestion, $selected, $isCorrect, $lesson, $durationSeconds) {
            $questionIds = $lesson->quizQuestions()
                ->where('is_active', true)
                ->pluck('id');

            $alreadySolvedCorrectly = QuizQuestionAttempt::query()
                ->where('user_id', $user->id)
                ->where('quiz_question_id', $quizQuestion->id)
                ->where('is_correct', true)
                ->exists();

            $xpEarned = ($isCorrect && ! $alreadySolvedCorrectly)
                ? $quizQuestion->xp_reward
                : 0;

            QuizQuestionAttempt::create([
                'user_id' => $user->id,
                'quiz_question_id' => $quizQuestion->id,
                'selected_answer' => $selected['id'],
                'is_correct' => $isCorrect,
                'xp_earned' => $xpEarned,
                'duration_seconds' => $durationSeconds,
                'answered_at' => now(),
            ]);

            $totalItems = $questionIds->count();

            $completedItemIds = QuizQuestionAttempt::query()
                ->where('user_id', $user->id)
                ->whereIn('quiz_question_id', $questionIds)
                ->distinct()
                ->pluck('quiz_question_id');

            $completedItems = $completedItemIds->count();

            $totalAttempts = QuizQuestionAttempt::query()
                ->where('user_id', $user->id)
                ->whereIn('quiz_question_id', $questionIds)
                ->count();

            $correctAnswers = QuizQuestionAttempt::query()
                ->where('user_id', $user->id)
                ->whereIn('quiz_question_id', $questionIds)
                ->where('is_correct', true)
                ->count();

            $xpTotal = QuizQuestionAttempt::query()
                ->where('user_id', $user->id)
                ->whereIn('quiz_question_id', $questionIds)
                ->sum('xp_earned');

            $progressPct = $totalItems > 0
                ? (int) floor(($completedItems / $totalItems) * 100)
                : 0;

            $status = match (true) {
                $progressPct === 0 => 'not_started',
                $progressPct >= 100 => 'completed',
                default => 'in_progress',
            };

            $progress = UserLessonProgress::query()->updateOrCreate(
                [
                    'user_id' => $user->id,
                    'lesson_id' => $lesson->id,
                ],
                [
                    'status' => $status,
                    'progress_pct' => $progressPct,
                    'total_items' => $totalItems,
                    'completed_items' => $completedItems,
                    'correct_answers' => $correctAnswers,
                    'total_attempts' => $totalAttempts,
                    'xp_earned' => $xpTotal,
                    'completed_at' => $status === 'completed' ? now() : null,
                    'last_activity_at' => now(),
                ]
            );

            return compact('xpEarned', 'progress');
        });

        return response()->json([
            'correct' => $isCorrect,
            'explanation' => $quizQuestion->explanation,
            'xp_earned' => $result['xpEarned'],
            'progress' => [
                'status' => $result['progress']->status,
                'progress_pct' => $result['progress']->progress_pct,
                'total_items' => $result['progress']->total_items,
                'completed_items' => $result['progress']->completed_items,
                'correct_answers' => $result['progress']->correct_answers,
                'total_attempts' => $result['progress']->total_attempts,
                'xp_earned' => $result['progress']->xp_earned,
            ],
        ]);
    }
}
