<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\FlashcardResource;
use App\Models\Country;
use App\Models\Flashcard;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

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
}
