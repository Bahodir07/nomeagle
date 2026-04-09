<?php

use App\Http\Controllers\Api\FlashcardController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\ModuleController;
use App\Http\Controllers\Api\ScenarioController;
use App\Http\Controllers\Api\LessonProgressController;
use App\Http\Controllers\Api\DashboardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CountryController;
use App\Http\Controllers\Api\QuizQuestionController;
use App\Http\Controllers\Api\LessonCompletionController;

Route::prefix('countries')->group(function () {
    Route::get('/', [CountryController::class, 'index']);
    Route::get('/{country:slug}', [CountryController::class, 'show']);

    Route::get('/{country:slug}/modules', [ModuleController::class, 'indexByCountry']);
    Route::get('/{country:slug}/modules/{module:slug}', [ModuleController::class, 'showInCountry']);

    Route::get('/{country:slug}/modules/{module:slug}/lessons', [LessonController::class, 'index']);
    Route::get('/{country:slug}/modules/{module:slug}/lessons/{lesson:slug}', [LessonController::class, 'show']);

    Route::get('/{country:slug}/modules/{module:slug}/lessons/{lesson:slug}/scenarios', [ScenarioController::class, 'index']);
    Route::get('/{country:slug}/modules/{module:slug}/lessons/{lesson:slug}/scenarios/{scenario:slug}', [ScenarioController::class, 'show']);

    Route::get('/{country:slug}/modules/{module:slug}/lessons/{lesson:slug}/quiz-questions', [QuizQuestionController::class, 'index']);
    Route::get('/{country:slug}/modules/{module:slug}/lessons/{lesson:slug}/quiz-questions/{quizQuestion}', [QuizQuestionController::class, 'show']);

    Route::get('/{country:slug}/modules/{module:slug}/lessons/{lesson:slug}/flashcards', [FlashcardController::class, 'index']);
    Route::get('/{country:slug}/modules/{module:slug}/lessons/{lesson:slug}/flashcards/{flashcard}', [FlashcardController::class, 'show']);

    Route::get(
        '/{country:slug}/modules/{module:slug}/lessons/{lesson:slug}/progress',
        [LessonProgressController::class, 'show']
    );

    Route::post(
        '/{country:slug}/modules/{module:slug}/lessons/{lesson:slug}/complete',
        [LessonCompletionController::class, 'complete']
    );

});

Route::get('/dashboard', [DashboardController::class, 'index']);

Route::prefix('scenarios')->group(function () {
    Route::post('/{scenario:slug}/submit', [ScenarioController::class, 'submit']);
});

Route::prefix('quiz-questions')->group(function () {
    Route::post('/{quizQuestion}/submit', [QuizQuestionController::class, 'submit']);
});

Route::prefix('flashcards')->group(function () {
    Route::post('/{flashcard}/review', [FlashcardController::class, 'review']);
});

Route::middleware('api')->group(function () {
    // routes
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
