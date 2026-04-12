<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\LessonCompletionEvent;
use App\Models\User;
use App\Models\UserLessonProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LessonCompletionController extends Controller
{
    public function complete(Request $request, Country $country, string $module, string $lesson): JsonResponse
    {
        abort_unless($country->is_active, 404);

        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Authentication required for progress tracking.',
            ], 401);
        }

        $moduleRecord = $country->modules()
            ->where('slug', $module)
            ->where('is_active', true)
            ->firstOrFail();

        $lessonRecord = $moduleRecord->lessons()
            ->where('slug', $lesson)
            ->where('is_active', true)
            ->firstOrFail();

        abort_unless(in_array($lessonRecord->type->value ?? $lessonRecord->type, ['video', 'article', 'summary'], true), 422);

        $request->validate([
            'duration_seconds' => ['nullable', 'integer', 'min:0'],
        ]);

        $durationSeconds = (int) $request->input('duration_seconds', 0);

        $result = DB::transaction(function () use ($user, $lessonRecord, $durationSeconds) {
            $alreadyCompleted = LessonCompletionEvent::query()
                ->where('user_id', $user->id)
                ->where('lesson_id', $lessonRecord->id)
                ->exists();

            $xpEarned = $alreadyCompleted ? 0 : (int) $lessonRecord->xp_reward;

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
                    'correct_answers' => 0,
                    'total_attempts' => $completionCount,
                    'xp_earned' => $xpTotal,
                    'completed_at' => $existingProgress?->completed_at ?? now(),
                    'last_activity_at' => now(),
                ]
            );

            return compact('xpEarned', 'progress');
        });

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
