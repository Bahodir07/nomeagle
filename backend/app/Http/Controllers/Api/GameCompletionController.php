<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class GameCompletionController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'game_type' => ['required', 'string', Rule::in([
                'culture_match', 'festival_timeline', 'guess_landmark', 'street_food_sprint',
            ])],
            'xp_earned' => ['required', 'integer', 'min:0', 'max:500'],
            'score'     => ['nullable', 'integer', 'min:0'],
        ]);

        $user = $request->user();
        $xpEarned = (int) $data['xp_earned'];

        if ($xpEarned === 0) {
            return response()->json([
                'xp_earned' => 0,
                'total_xp'  => $user->total_xp ?? 0,
            ]);
        }

        $result = DB::transaction(function () use ($user, $data, $xpEarned) {
            // Allow multiple XP grants per game type per day — deduplicate by date bucket.
            $dateBucket = now()->format('Y-m-d');
            $grantableId = crc32($data['game_type'] . ':' . $dateBucket . ':' . ($data['score'] ?? 0));

            $granted = (bool) DB::table('user_xp_grants')->insertOrIgnore([
                'user_id'        => $user->id,
                'grantable_type' => 'game',
                'grantable_id'   => $grantableId,
                'created_at'     => now(),
                'updated_at'     => now(),
            ]);

            if ($granted) {
                $user->increment('total_xp', $xpEarned);
                $user->refresh();
            }

            return ['granted' => $granted, 'total_xp' => (int) ($user->total_xp ?? 0)];
        });

        $userId = $user->id;
        Cache::forget("dashboard:user:{$userId}");
        Cache::forget("statistics:user:{$userId}");

        if ($result['granted'] && $xpEarned > 0) {
            UserNotification::create([
                'user_id' => $userId,
                'type'    => 'lesson_completed',
                'title'   => 'Game Complete!',
                'body'    => "You finished a mini-game and earned {$xpEarned} XP.",
                'data'    => ['game_type' => $data['game_type'], 'xp' => $xpEarned],
            ]);
        }

        return response()->json([
            'xp_earned' => $result['granted'] ? $xpEarned : 0,
            'total_xp'  => $result['total_xp'],
        ]);
    }
}
