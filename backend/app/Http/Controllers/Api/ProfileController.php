<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserLessonProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        $xp = UserLessonProgress::where('user_id', $user->id)->sum('xp_earned');
        $level = intdiv($xp, 100) + 1;

        return response()->json([
            'profile' => [
                'userId'            => (string) $user->id,
                'displayName'       => $user->name,
                'email'             => $user->email,
                'bio'               => $user->bio ?? '',
                'avatarUrl'         => $user->avatar_url,
                'level'             => $level,
                'xp'                => (int) $xp,
                'streakDays'        => (int) ($user->current_streak ?? 0),
                'selectedCountries' => $user->selected_countries ?? [],
                'interests'         => $user->interests ?? [],
                'difficulty'        => $user->difficulty ?? 'beginner',
            ],
        ]);
    }

    public function updateBasics(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'displayName' => ['required', 'string', 'max:64'],
            'bio'         => ['nullable', 'string', 'max:120'],
        ]);

        $user = $request->user();
        $user->update([
            'name' => $validated['displayName'],
            'bio'  => $validated['bio'] ?? null,
        ]);

        return response()->json(['message' => 'Profile updated.']);
    }

    public function updatePreferences(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'selectedCountries'   => ['required', 'array'],
            'selectedCountries.*' => ['string'],
            'interests'           => ['required', 'array'],
            'interests.*'         => ['string'],
            'difficulty'          => ['required', 'in:beginner,intermediate,advanced'],
        ]);

        $request->user()->update([
            'selected_countries' => $validated['selectedCountries'],
            'interests'          => $validated['interests'],
            'difficulty'         => $validated['difficulty'],
        ]);

        return response()->json(['message' => 'Preferences updated.']);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'currentPassword' => ['required', 'string'],
            'newPassword'     => ['required', 'confirmed', Password::min(8)],
        ]);

        $user = $request->user();

        if (!Hash::check($validated['currentPassword'], $user->password)) {
            return response()->json(['message' => 'Current password is incorrect.'], 422);
        }

        $user->update(['password' => Hash::make($validated['newPassword'])]);

        return response()->json(['message' => 'Password updated.']);
    }

    public function destroy(Request $request): JsonResponse
    {
        $user = $request->user();

        $request->user()->tokens()->delete();

        if ($user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
        }

        $user->delete();

        return response()->json(['message' => 'Account deleted.']);
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'max:2048', 'mimes:jpg,jpeg,png,webp,gif'],
        ]);

        $user = $request->user();

        if ($user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
        }

        $path = $request->file('avatar')->store("avatars/{$user->id}", 'public');

        $user->update(['avatar_path' => $path]);

        return response()->json([
            'avatarUrl' => Storage::disk('s3')->url($path),
        ]);
    }
}

