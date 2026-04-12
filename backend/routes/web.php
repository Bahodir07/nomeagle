<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);

    if (!Auth::attempt($credentials, remember: true)) {
        return response()->json([
            'message' => 'Invalid credentials.',
        ], 422);
    }

    $request->session()->regenerate();

    return response()->json([
        'message' => 'Unauthenticated.',
    ], 401);
})->name('login');;

Route::post('/logout', function (Request $request) {
    Auth::guard('web')->logout();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return response()->json([
        'message' => 'Logged out successfully.',
    ]);
})->middleware('auth');
