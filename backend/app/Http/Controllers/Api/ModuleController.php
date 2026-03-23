<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\ModuleResource;
use App\Models\Country;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ModuleController extends Controller
{
    public function indexByCountry(Country $country): AnonymousResourceCollection
    {
        abort_unless($country->is_active, 404);

        $modules = $country->modules()
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        return ModuleResource::collection($modules);
    }

    public function showInCountry(Country $country, string $module): ModuleResource
    {
        abort_unless($country->is_active, 404);

        $moduleRecord = $country->modules()
            ->where('slug', $module)
            ->where('is_active', true)
            ->firstOrFail();

        return new ModuleResource($moduleRecord);
    }
}
