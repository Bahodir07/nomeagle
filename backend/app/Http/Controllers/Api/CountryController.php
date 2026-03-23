<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\CountryResource;
use App\Models\Country;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CountryController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $countries = Country::query()
            ->active()
            ->orderBy('name')
            ->get();

        return CountryResource::collection($countries);
    }

    public function show(Country $country): CountryResource
    {
        abort_unless($country->is_active, 404);

        return new CountryResource($country);
    }
}
