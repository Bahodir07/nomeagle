<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CompleteLessonRequest;
use App\Models\Country;
use App\Models\LessonCompletionEvent;
use App\Models\UserLessonProgress;
use App\Models\UserNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class LessonCompletionController extends Controller
{
    public function complete(CompleteLessonRequest $request, Country $country, string $module, string $lesson): JsonResponse
    {
        abort_unless($country->is_active, 404);

        $user = $request->user();


        $moduleRecord = $country->modules()
            ->where('slug', $module)
            ->where('is_active', true)
            ->firstOrFail();


        $lessonRecord = $moduleRecord->lessons()
            ->where('slug', $lesson)
            ->where('is_active', true)
            ->firstOrFail();


        $allowedTypes = [
            'video', 'article', 'summary', 'quiz', 'scenario',
            'flashcards', 'flashcard', 'matching', 'open_response'
        ];

        $currentType = $lessonRecord->type->value ?? $lessonRecord->type;


        abort_unless(in_array($currentType, $allowedTypes, true), 422);

        $durationSeconds  = (int)$request->input('duration_seconds', 0);
        $correctAnswers   = $request->has('correct_answers') ? (int)$request->input('correct_answers') : null;
        $totalAttempts    = $request->has('total_attempts')  ? (int)$request->input('total_attempts')  : null;

        $result = DB::transaction(function () use ($user, $lessonRecord, $durationSeconds, $correctAnswers, $totalAttempts) {
            $granted = DB::table('user_xp_grants')->insertOrIgnore([
                'user_id'        => $user->id,
                'grantable_type' => 'lesson',
                'grantable_id'   => $lessonRecord->id,
                'created_at'     => now(),
                'updated_at'     => now(),
            ]);

            $xpEarned = $granted ? (int) $lessonRecord->xp_reward : 0;

            LessonCompletionEvent::create([
                'user_id' => $user->id,
                'lesson_id' => $lessonRecord->id,
                'xp_earned' => $xpEarned,
                'duration_seconds' => $durationSeconds,
                'completed_at' => now(),
            ]);

            $completionCount = LessonCompletionEvent::query()
                ->where('user_id', $user->id)
                ->where('lesson_id', $lessonRecord->id)
                ->count();

            $existingProgress = UserLessonProgress::query()
                ->where('user_id', $user->id)
                ->where('lesson_id', $lessonRecord->id)
                ->first();

            $xpTotal = max($existingProgress?->xp_earned ?? 0, $xpEarned);

            $progress = UserLessonProgress::query()->updateOrCreate(
                [
                    'user_id' => $user->id,
                    'lesson_id' => $lessonRecord->id,
                ],
                [
                    'status' => 'completed',
                    'progress_pct' => 100,
                    'total_items' => 1,
                    'completed_items' => 1,
                    'correct_answers' => $correctAnswers ?? 0,
                    'total_attempts' => $totalAttempts ?? $completionCount,
                    'xp_earned' => $xpTotal,
                    'completed_at' => $existingProgress?->completed_at ?? now(),
                    'last_activity_at' => now(),
                ]
            );

            if ($xpEarned > 0) {
                $user->updateStreak();
            }

            return compact('xpEarned', 'progress');
        });

        $userId = $user->id;
        Cache::forget("dashboard:user:{$userId}");
        Cache::forget("statistics:user:{$userId}");
        Cache::forget("achievements:user:{$userId}");

        if ($result['xpEarned'] > 0) {
            UserNotification::create([
                'user_id' => $userId,
                'type'    => 'lesson_completed',
                'title'   => 'Lesson Complete!',
                'body'    => "You finished \"{$lessonRecord->title}\" and earned {$result['xpEarned']} XP.",
                'data'    => ['lesson_id' => $lessonRecord->id, 'xp' => $result['xpEarned']],
            ]);

            $user->refresh();
            $streak = (int) $user->current_streak;
            if (in_array($streak, [3, 7, 14, 30, 60, 100, 365], true)) {
                UserNotification::create([
                    'user_id' => $userId,
                    'type'    => 'streak_milestone',
                    'title'   => "{$streak}-Day Streak!",
                    'body'    => "Amazing! You've kept a {$streak}-day learning streak going. Keep it up!",
                    'data'    => ['streak_days' => $streak],
                ]);
            }
        }

        return response()->json([
            'completed' => true,
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
