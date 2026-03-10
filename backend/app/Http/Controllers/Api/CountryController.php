<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Country;

class CountryController extends Controller
{
    public function index(Request $request)
    {
        $query = Country::query()->where('is_active', true);
        if ($region = $request->get('region')) {
            $query->where('region', $region);
        }
        return response()->json(['data' => $query->orderBy('name')->get()]);
    }

    public function show(Country $country)
    {
        abort_unless($country->is_active, 404);

        return response()->json([
            'data' => $country
        ]);
    }

}
