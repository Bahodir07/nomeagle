<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\LessonProgressResource;
use App\Models\Country;
use App\Models\User;
use App\Models\UserLessonProgress;
use Illuminate\Http\Request;

class LessonProgressController extends Controller
{
    public function show(Request $request, Country $country, string $module, string $lesson)
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

        $progress = UserLessonProgress::query()
            ->firstOrCreate(
                [
                    'user_id' => $user->id,
                    'lesson_id' => $lessonRecord->id,
                ],
                [
                    'status' => 'not_started',
                    'progress_pct' => 0,
                    'total_items' => 0,
                    'completed_items' => 0,
                    'correct_answers' => 0,
                    'total_attempts' => 0,
                    'xp_earned' => 0,
                    'completed_at' => null,
                    'last_activity_at' => null,
                ]
            );

        return new LessonProgressResource($progress);
    }
}
