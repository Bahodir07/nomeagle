<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user          = $request->user();
        $notifications = UserNotification::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->limit(30)
            ->get();

        $unreadCount = UserNotification::where('user_id', $user->id)
            ->whereNull('read_at')
            ->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count'  => $unreadCount,
        ]);
    }

    public function readOne(Request $request, UserNotification $notification): JsonResponse
    {
        abort_if($notification->user_id !== $request->user()->id, 403);

        $notification->update(['read_at' => now()]);

        return response()->json(['message' => 'Marked as read.']);
    }

    public function readAll(Request $request): JsonResponse
    {
        UserNotification::where('user_id', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'All notifications marked as read.']);
    }

    public function achievement(Request $request): JsonResponse
    {
        $validBadgeIds = [
            'first-step', 'cultural-traveler', 'world-explorer', 'global-citizen', 'master-explorer',
            'streak-3',
            'it-expert', 'cn-scholar', 'de-expert', 'jp-scholar', 'fr-expert',
            'br-expert', 'ca-scholar', 'au-expert', 'in-scholar', 'mx-expert',
            'kz-scholar', 'tr-scholar', 'es-expert', 'eg-scholar', 'th-expert',
            'perfect-quiz',
        ];

        $request->validate([
            'badge_id'    => ['required', 'string', 'in:' . implode(',', $validBadgeIds)],
            'title'       => 'required|string|max:255',
            'description' => 'required|string|max:500',
        ]);

        $user = $request->user();

        // Deduplicate: only create one notification per badge per user
        $exists = UserNotification::where('user_id', $user->id)
            ->where('type', 'achievement_unlocked')
            ->whereJsonContains('data->badge_id', $request->badge_id)
            ->exists();

        if (!$exists) {
            UserNotification::create([
                'user_id' => $user->id,
                'type'    => 'achievement_unlocked',
                'title'   => 'Badge Unlocked: ' . $request->title,
                'body'    => $request->description,
                'data'    => ['badge_id' => $request->badge_id],
            ]);
        }

        return response()->json(['message' => 'Recorded.'], 201);
    }
}
