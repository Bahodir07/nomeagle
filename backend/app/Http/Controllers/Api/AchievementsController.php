<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\UserLessonProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AchievementsController extends Controller
{
    public function index(): JsonResponse
    {
        $user = request()->user();

        $data = Cache::remember("achievements:user:{$user->id}", 300, fn() => $this->buildAchievements($user));

        return response()->json($data);
    }

    private function buildAchievements($user): array
    {
        $countries = Country::query()
            ->where('is_active', true)
            ->with([
                'modules' => fn($q) => $q->where('is_active', true)
                    ->with(['lessons' => fn($lq) => $lq->where('is_active', true)]),
            ])
            ->get();

        $completedLessonIds = UserLessonProgress::query()
            ->where('user_id', $user->id)
            ->where('status', 'completed')
            ->pluck('lesson_id')
            ->flip();

        $completedCountryCodes = [];
        $completedLessonsByCountry = [];
        $totalLessonsByCountry = [];

        foreach ($countries as $country) {
            $lessons = $country->modules->flatMap(fn($m) => $m->lessons);
            $total = $lessons->count();

            if ($total === 0) {
                continue;
            }

            $isoCode = strtolower($country->iso_code ?? '');
            $key = $isoCode ?: $country->slug;

            $completed = $lessons->filter(fn($l) => isset($completedLessonIds[$l->id]))->count();

            $completedLessonsByCountry[$key] = $completed;
            $totalLessonsByCountry[$key] = $total;

            if ($completed >= $total && $isoCode) {
                $completedCountryCodes[] = $isoCode;
            }
        }

        $perfectQuizCount = $this->computePerfectQuizCount($user->id);
        $lastQuizScorePct = $this->computeLastQuizScorePct($user->id);

        return [
            'completedCountriesCount' => count($completedCountryCodes),
            'completedCountryCodes' => $completedCountryCodes,
            'currentStreakDays' => (int) ($user->current_streak ?? 0),
            'bestStreakDays' => (int) ($user->longest_streak ?? 0),
            'perfectQuizCount' => $perfectQuizCount,
            'lastQuizScorePct' => $lastQuizScorePct,
            'completedLessonsByCountry' => $completedLessonsByCountry,
            'totalLessonsByCountry' => $totalLessonsByCountry,
        ];
    }

    private function computePerfectQuizCount(int $userId): int
    {
        // Single aggregation query: count lessons where every active question
        // has at least one correct attempt from this user.
        return DB::table('quiz_questions as q')
            ->selectRaw('q.lesson_id')
            ->selectRaw('COUNT(DISTINCT q.id) as total')
            ->selectRaw('COUNT(DISTINCT CASE WHEN a.is_correct = 1 THEN a.quiz_question_id END) as correct_count')
            ->leftJoin('quiz_question_attempts as a', function ($join) use ($userId) {
                $join->on('a.quiz_question_id', '=', 'q.id')
                     ->where('a.user_id', $userId);
            })
            ->where('q.is_active', true)
            ->groupBy('q.lesson_id')
            ->havingRaw('correct_count >= total')
            ->get()
            ->count();
    }

    private function computeLastQuizScorePct(int $userId): ?int
    {
        // Query 1: find the lesson of the most recent attempt
        $lessonId = DB::table('quiz_question_attempts as a')
            ->join('quiz_questions as q', 'q.id', '=', 'a.quiz_question_id')
            ->where('a.user_id', $userId)
            ->where('q.is_active', true)
            ->orderByDesc('a.created_at')
            ->value('q.lesson_id');

        if (! $lessonId) {
            return null;
        }

        // Query 2: score for that lesson
        $row = DB::table('quiz_questions as q')
            ->selectRaw('COUNT(DISTINCT q.id) as total')
            ->selectRaw('COUNT(DISTINCT CASE WHEN a.is_correct = 1 THEN a.quiz_question_id END) as correct_count')
            ->leftJoin('quiz_question_attempts as a', function ($join) use ($userId) {
                $join->on('a.quiz_question_id', '=', 'q.id')
                     ->where('a.user_id', $userId);
            })
            ->where('q.lesson_id', $lessonId)
            ->where('q.is_active', true)
            ->first();

        if (! $row || $row->total === 0) {
            return null;
        }

        return (int) floor(($row->correct_count / $row->total) * 100);
    }
}
