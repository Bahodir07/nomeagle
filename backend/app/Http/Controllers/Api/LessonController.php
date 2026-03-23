<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\LessonResource;
use App\Models\Country;
use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class LessonController extends Controller
{
    public function index(Country $country, string $module): AnonymousResourceCollection
    {
        abort_unless($country->is_active, 404);

        $moduleRecord = $country->modules()
            ->where('slug', $module)
            ->where('is_active', true)
            ->firstOrFail();

        $lessons = $moduleRecord->lessons()
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        return LessonResource::collection($lessons);
    }

    public function show(Country $country, string $module, Lesson $lesson): LessonResource
    {
        abort_unless($country->is_active, 404);

        $moduleRecord = $country->modules()
            ->where('slug', $module)
            ->where('is_active', true)
            ->firstOrFail();

        abort_unless($lesson->module_id === $moduleRecord->id, 404);
        abort_unless($lesson->is_active, 404);

        return new LessonResource($lesson);
    }
}
