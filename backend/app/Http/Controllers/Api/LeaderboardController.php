<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\UserLessonProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class LeaderboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user      = $request->user();
        $timeRange = $request->query('time_range', 'week');
        $perPage   = min((int) $request->query('per_page', 50), 100);
        $page      = max((int) $request->query('page', 1), 1);

        $since = match ($timeRange) {
            'today' => now()->startOfDay(),
            'week'  => now()->startOfWeek(),
            'month' => now()->startOfMonth(),
            default => null,
        };

        try {
            $totalActiveLessons = Cache::remember('leaderboard:total_lessons', 600, fn() =>
                Lesson::where('is_active', true)->count()
            );
        } catch (\Exception $e) {
            $totalActiveLessons = Lesson::where('is_active', true)->count();
        }

        $cacheKey = "leaderboard:{$timeRange}:p{$page}:pp{$perPage}";

        $buildEntries = fn() => UserLessonProgress::query()
            ->join('users', 'user_lesson_progress.user_id', '=', 'users.id')
            ->select([
                'users.id',
                'users.name',
                'users.avatar_path',
                'users.current_streak',
                DB::raw('SUM(user_lesson_progress.xp_earned) as xp'),
                DB::raw("SUM(CASE WHEN user_lesson_progress.status = 'completed' THEN 1 ELSE 0 END) as completed_count"),
            ])
            ->when($since, fn($q) => $q->where('user_lesson_progress.updated_at', '>=', $since))
            ->groupBy('users.id', 'users.name', 'users.avatar_path', 'users.current_streak')
            ->orderByDesc('xp')
            ->limit($perPage)
            ->offset(($page - 1) * $perPage)
            ->get()
            ->map(function ($row) use ($totalActiveLessons) {
                $xp        = (int) $row->xp;
                $completed = (int) $row->completed_count;
                $lessonsCompletedPct = $totalActiveLessons > 0
                    ? (int) floor(($completed / $totalActiveLessons) * 100)
                    : 0;

                return [
                    'userId'              => (string) $row->id,
                    'name'                => $row->name,
                    'avatarUrl'           => $row->avatar_path
                        ? \Illuminate\Support\Facades\Storage::disk('s3')->url($row->avatar_path)
                        : null,
                    'level'               => intdiv($xp, 100) + 1,
                    'xp'                  => $xp,
                    'streakDays'          => (int) ($row->current_streak ?? 0),
                    'lessonsCompletedPct' => $lessonsCompletedPct,
                ];
            })
            ->values();

        try {
            $entries = Cache::remember($cacheKey, 120, $buildEntries);
        } catch (\Exception $e) {
            $entries = $buildEntries();
        }

        return response()->json([
            'timeRange'     => $timeRange,
            'entries'       => $entries,
            'currentUserId' => (string) $user->id,
            'page'          => $page,
            'perPage'       => $perPage,
        ]);
    }
}

