<?php

use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\ModuleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CountryController;

Route::prefix('countries')->group(function () {
    Route::get('/', [CountryController::class, 'index']);
    Route::get('/{country:slug}', [CountryController::class, 'show']);

    Route::get('/{country:slug}/modules', [ModuleController::class, 'indexByCountry']);
    Route::get('/{country:slug}/modules/{module:slug}', [ModuleController::class, 'showInCountry']);

    Route::get('/{country:slug}/modules/{module:slug}/lessons', [LessonController::class, 'index']);
    Route::get('/{country:slug}/modules/{module:slug}/lessons/{lesson:slug}', [LessonController::class, 'show']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
