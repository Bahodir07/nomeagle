<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\User;
use App\Models\UserLessonProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LeaderboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $timeRange = $request->query('time_range', 'week');

        $since = match ($timeRange) {
            'today' => now()->startOfDay(),
            'week'  => now()->startOfWeek(),
            'month' => now()->startOfMonth(),
            default => null,
        };

        $totalActiveLessons = Lesson::where('is_active', true)->count();

        $xpQuery = UserLessonProgress::query()
            ->select('user_id', DB::raw('SUM(xp_earned) as xp'))
            ->when($since, fn($q) => $q->where('updated_at', '>=', $since))
            ->groupBy('user_id');

        $xpByUser = $xpQuery->pluck('xp', 'user_id');

        if ($xpByUser->isEmpty()) {
            return response()->json([
                'timeRange'     => $timeRange,
                'entries'       => [],
                'currentUserId' => (string) $user->id,
            ]);
        }

        $users = User::whereIn('id', $xpByUser->keys())
            ->get(['id', 'name', 'avatar_path', 'current_streak']);

        $completedByUser = UserLessonProgress::query()
            ->whereIn('user_id', $xpByUser->keys())
            ->where('status', 'completed')
            ->select('user_id', DB::raw('COUNT(*) as cnt'))
            ->groupBy('user_id')
            ->pluck('cnt', 'user_id');

        $entries = $users->map(function (User $u) use ($xpByUser, $completedByUser, $totalActiveLessons) {
            $xp = (int) ($xpByUser[$u->id] ?? 0);
            $level = intdiv($xp, 100) + 1;
            $completedCount = (int) ($completedByUser[$u->id] ?? 0);
            $lessonsCompletedPct = $totalActiveLessons > 0
                ? (int) floor(($completedCount / $totalActiveLessons) * 100)
                : 0;

            return [
                'userId'              => (string) $u->id,
                'name'                => $u->name,
                'avatarUrl'           => $u->avatar_url,
                'level'               => $level,
                'xp'                  => $xp,
                'streakDays'          => (int) ($u->current_streak ?? 0),
                'lessonsCompletedPct' => $lessonsCompletedPct,
            ];
        })->sortByDesc('xp')->values();

        return response()->json([
            'timeRange'     => $timeRange,
            'entries'       => $entries,
            'currentUserId' => (string) $user->id,
        ]);
    }
}
