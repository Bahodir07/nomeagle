<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\MatchingPairResource;
use App\Models\Country;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MatchingPairController extends Controller
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

        $pairs = $lessonRecord->matchingPairs()
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        return MatchingPairResource::collection($pairs);
    }
}
