<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CountryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FlashcardController;
use App\Http\Controllers\Api\LessonCompletionController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\LessonProgressController;
use App\Http\Controllers\Api\ModuleController;
use App\Http\Controllers\Api\QuizQuestionController;
use App\Http\Controllers\Api\MatchingPairController;
use App\Http\Controllers\Api\ScenarioController;
use App\Http\Controllers\Api\AchievementsController;
use App\Http\Controllers\Api\LearningPathController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\StatisticsController;
use App\Http\Controllers\Api\LeaderboardController;
use App\Http\Controllers\Api\NotificationsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Auth routes (token-based, no session)
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

/*
|--------------------------------------------------------------------------
| Public read API
|--------------------------------------------------------------------------
*/

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

    Route::get('/{country:slug}/modules/{module:slug}/lessons/{lesson:slug}/matching-pairs', [MatchingPairController::class, 'index']);
});

/*
|--------------------------------------------------------------------------
| Protected API
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::patch('/profile', [ProfileController::class, 'updateBasics']);
    Route::patch('/profile/preferences', [ProfileController::class, 'updatePreferences']);
    Route::patch('/profile/password', [ProfileController::class, 'updatePassword']);
    Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar']);
    Route::delete('/profile', [ProfileController::class, 'destroy']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::get('/statistics', [StatisticsController::class, 'index']);

    Route::get('/achievements', [AchievementsController::class, 'index']);

    Route::get('/leaderboard', [LeaderboardController::class, 'index']);

    Route::get('/notifications', [NotificationsController::class, 'index']);
    Route::post('/notifications/read-all', [NotificationsController::class, 'readAll']);
    Route::patch('/notifications/{notification}/read', [NotificationsController::class, 'readOne']);
    Route::post('/notifications/achievement', [NotificationsController::class, 'achievement']);

    Route::get('/countries/{country:slug}/learning-path', [LearningPathController::class, 'show']);

    Route::get(
        '/countries/{country:slug}/modules/{module:slug}/lessons/{lesson:slug}/progress',
        [LessonProgressController::class, 'show']
    );

    Route::post(
        '/countries/{country:slug}/modules/{module:slug}/lessons/{lesson:slug}/complete',
        [LessonCompletionController::class, 'complete']
    );

    Route::middleware('throttle:120,1')->group(function () {
        Route::post('/scenarios/{scenario}/submit', [ScenarioController::class, 'submit']);
        Route::post('/quiz-questions/{quizQuestion}/submit', [QuizQuestionController::class, 'submit']);
        Route::post('/flashcards/{flashcard}/review', [FlashcardController::class, 'review']);
    });
});
