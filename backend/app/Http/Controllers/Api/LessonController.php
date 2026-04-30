<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\LessonResource;
use App\Models\Country;
use App\Models\Lesson;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

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

    public function show(Country $country, string $module, Lesson $lesson): JsonResponse
    {
        abort_unless($country->is_active, 404);

        $moduleRecord = $country->modules()
            ->where('slug', $module)
            ->where('is_active', true)
            ->firstOrFail();

        abort_unless($lesson->module_id === $moduleRecord->id, 404);
        abort_unless($lesson->is_active, 404);

        // Next lesson in same module
        $nextLesson = $moduleRecord->lessons()
            ->where('is_active', true)
            ->where('order', '>', $lesson->order)
            ->orderBy('order')
            ->first(['slug', 'title', 'type', 'estimated_minutes']);

        $nextModuleSlug = $module;

        // If none, take first lesson of next active module in the same country
        if (! $nextLesson) {
            $nextModule = $country->modules()
                ->where('is_active', true)
                ->where('order', '>', $moduleRecord->order)
                ->orderBy('order')
                ->first();

            if ($nextModule) {
                $nextLesson = $nextModule->lessons()
                    ->where('is_active', true)
                    ->orderBy('order')
                    ->first(['slug', 'title', 'type', 'estimated_minutes']);

                $nextModuleSlug = $nextModule->slug;
            }
        }

        return response()->json([
            'id'                 => $lesson->id,
            'module'             => [
                'id'    => $moduleRecord->id,
                'title' => $moduleRecord->title,
                'slug'  => $moduleRecord->slug,
            ],
            'title'              => $lesson->title,
            'slug'               => $lesson->slug,
            'type'               => $lesson->type,
            'description'        => $lesson->description,
            'content'            => $lesson->content,
            'video_source'       => $lesson->video_source,
            'video_file'         => $lesson->video_file,
            'video_url'          => $lesson->video_file ? Storage::disk('s3')->url($lesson->video_file) : null,
            'external_video_url' => $lesson->external_video_url,
            'video_disk'         => $lesson->video_disk,
            'order'              => $lesson->order,
            'xp_reward'          => $lesson->xp_reward,
            'stars_reward'       => $lesson->stars_reward,
            'estimated_minutes'  => $lesson->estimated_minutes,
            'is_active'          => $lesson->is_active,
            'next_lesson'        => $nextLesson ? [
                'slug'             => $nextLesson->slug,
                'title'            => $nextLesson->title,
                'type'             => $nextLesson->type instanceof \BackedEnum ? $nextLesson->type->value : (string) $nextLesson->type,
                'moduleSlug'       => $nextModuleSlug,
                'countrySlug'      => $country->slug,
                'estimatedMinutes' => $nextLesson->estimated_minutes,
            ] : null,
        ]);
    }
}
