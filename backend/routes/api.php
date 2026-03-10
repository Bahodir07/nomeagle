<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CountryController;

Route::prefix('v1')->group(function () {
    Route::get('/countries', [CountryController::class, 'index']);
    Route::get('/countries/{country:slug}', [CountryController::class, 'show']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
