<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\SubmitScenarioRequest;
use App\Http\Resources\Api\ScenarioResource;
use App\Models\Country;
use App\Models\Scenario;
use App\Models\ScenarioAttempt;
use App\Models\UserLessonProgress;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ScenarioController extends Controller
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

        $scenarios = $lessonRecord->scenarios()
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        return ScenarioResource::collection($scenarios);
    }

    public function show(Country $country, string $module, string $lesson, Scenario $scenario): ScenarioResource
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

        abort_unless($scenario->lesson_id === $lessonRecord->id, 404);
        abort_unless($scenario->is_active, 404);

        return new ScenarioResource($scenario);
    }

    public function submit(SubmitScenarioRequest $request, Scenario $scenario)
    {
        abort_unless($scenario->is_active, 404);

        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Authentication required for progress tracking.',
            ], 401);
        }

        $payload = $scenario->normalizedPayload();

        if (! isset($payload['options']) || ! is_array($payload['options'])) {
            return response()->json([
                'error' => 'Invalid scenario payload',
            ], 500);
        }

        $selected = collect($payload['options'])
            ->firstWhere('id', $request->input('answer'));

        if (! $selected) {
            return response()->json([
                'error' => 'Invalid answer',
            ], 422);
        }

        $isCorrect = (bool) ($selected['is_correct'] ?? false);
        $lesson = $scenario->lesson;
        $durationSeconds = (int) $request->input('duration_seconds', 0);

        $result = DB::transaction(function () use ($user, $scenario, $selected, $isCorrect, $lesson, $durationSeconds) {
            $scenarioIds = $lesson->scenarios()
                ->where('is_active', true)
                ->pluck('id');

            $xpEarned = 0;
            if ($isCorrect) {
                $granted = DB::table('user_xp_grants')->insertOrIgnore([
                    'user_id'        => $user->id,
                    'grantable_type' => 'scenario',
                    'grantable_id'   => $scenario->id,
                    'created_at'     => now(),
                    'updated_at'     => now(),
                ]);
                $xpEarned = $granted ? $scenario->xp_reward : 0;
            }

            ScenarioAttempt::create([
                'user_id' => $user->id,
                'scenario_id' => $scenario->id,
                'selected_answer' => $selected['id'],
                'is_correct' => $isCorrect,
                'xp_earned' => $xpEarned,
                'duration_seconds' => $durationSeconds,
                'answered_at' => now(),
            ]);

            $totalItems = $scenarioIds->count();

            $completedItemIds = ScenarioAttempt::query()
                ->where('user_id', $user->id)
                ->whereIn('scenario_id', $scenarioIds)
                ->distinct()
                ->pluck('scenario_id');

            $completedItems = $completedItemIds->count();

            $totalAttempts = ScenarioAttempt::query()
                ->where('user_id', $user->id)
                ->whereIn('scenario_id', $scenarioIds)
                ->count();

            $correctAnswers = ScenarioAttempt::query()
                ->where('user_id', $user->id)
                ->whereIn('scenario_id', $scenarioIds)
                ->where('is_correct', true)
                ->count();

            $xpTotal = ScenarioAttempt::query()
                ->where('user_id', $user->id)
                ->whereIn('scenario_id', $scenarioIds)
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

        $userId = $user->id;
        Cache::forget("dashboard:user:{$userId}");
        Cache::forget("statistics:user:{$userId}");

        return response()->json([
            'correct' => $isCorrect,
            'explanation' => $selected['explanation'] ?? null,
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
