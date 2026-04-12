<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\FlashcardResource;
use App\Models\Country;
use App\Models\Flashcard;
use App\Models\FlashcardReview;
use App\Models\UserLessonProgress;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class FlashcardController extends Controller
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

        $flashcards = $lessonRecord->flashcards()
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        return FlashcardResource::collection($flashcards);
    }

    public function show(Country $country, string $module, string $lesson, Flashcard $flashcard): FlashcardResource
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

        abort_unless($flashcard->lesson_id === $lessonRecord->id, 404);
        abort_unless($flashcard->is_active, 404);

        return new FlashcardResource($flashcard);
    }

    public function review(Request $request, Flashcard $flashcard)
    {
        abort_unless($flashcard->is_active, 404);

        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Authentication required for progress tracking.',
            ], 401);
        }

        $request->validate([
            'rating' => ['required', 'in:again,good,easy'],
            'shown_at' => ['nullable', 'date'],
            'flipped_at' => ['nullable', 'date'],
            'duration_seconds' => ['nullable', 'integer', 'min:0'],
        ]);

        $lesson = $flashcard->lesson;
        $rating = $request->string('rating')->toString();
        $durationSeconds = (int) $request->input('duration_seconds', 0);

        $result = DB::transaction(function () use ($user, $flashcard, $lesson, $rating, $request, $durationSeconds) {
            $alreadyRewarded = FlashcardReview::query()
                ->where('user_id', $user->id)
                ->where('flashcard_id', $flashcard->id)
                ->whereIn('rating', ['good', 'easy'])
                ->exists();

            $xpEarned = match ($rating) {
                'good' => $alreadyRewarded ? 0 : 1,
                'easy' => $alreadyRewarded ? 0 : 2,
                default => 0,
            };

            FlashcardReview::create([
                'user_id' => $user->id,
                'flashcard_id' => $flashcard->id,
                'rating' => $rating,
                'xp_earned' => $xpEarned,
                'duration_seconds' => $durationSeconds,
                'shown_at' => $request->input('shown_at') ?: now(),
                'flipped_at' => $request->input('flipped_at'),
                'reviewed_at' => now(),
            ]);

            $flashcardIds = $lesson->flashcards()
                ->where('is_active', true)
                ->pluck('id');

            $totalItems = $flashcardIds->count();

            $completedItemIds = FlashcardReview::query()
                ->where('user_id', $user->id)
                ->whereIn('flashcard_id', $flashcardIds)
                ->distinct()
                ->pluck('flashcard_id');

            $completedItems = $completedItemIds->count();

            $totalAttempts = FlashcardReview::query()
                ->where('user_id', $user->id)
                ->whereIn('flashcard_id', $flashcardIds)
                ->count();

            $positiveRatings = FlashcardReview::query()
                ->where('user_id', $user->id)
                ->whereIn('flashcard_id', $flashcardIds)
                ->whereIn('rating', ['good', 'easy'])
                ->count();

            $xpTotal = FlashcardReview::query()
                ->where('user_id', $user->id)
                ->whereIn('flashcard_id', $flashcardIds)
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
                    'correct_answers' => $positiveRatings,
                    'total_attempts' => $totalAttempts,
                    'xp_earned' => $xpTotal,
                    'completed_at' => $status === 'completed' ? now() : null,
                    'last_activity_at' => now(),
                ]
            );

            return compact('xpEarned', 'progress');
        });

        return response()->json([
            'rating' => $rating,
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
