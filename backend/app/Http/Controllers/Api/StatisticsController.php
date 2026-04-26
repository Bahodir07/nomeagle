<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\FlashcardReview;
use App\Models\Lesson;
use App\Models\LessonCompletionEvent;
use App\Models\QuizQuestionAttempt;
use App\Models\ScenarioAttempt;
use App\Models\UserLessonProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    public function index(): JsonResponse
    {
        $user = request()->user();

        try {
            $data = Cache::remember("statistics:user:{$user->id}", 300, fn() => $this->buildStatistics($user));
        } catch (\Exception $e) {
            $data = $this->buildStatistics($user);
        }

        return response()->json($data);
    }

    private function buildStatistics($user): array
    {
        // --- XP / Level ---
        $xp = (int) UserLessonProgress::where('user_id', $user->id)->sum('xp_earned');
        $level = intdiv($xp, 100) + 1;
        $xpCurrent = $xp % 100;

        // --- Accuracy & Coverage ---
        $quizTotal = QuizQuestionAttempt::where('user_id', $user->id)->count();
        $quizCorrect = QuizQuestionAttempt::where('user_id', $user->id)->where('is_correct', true)->count();
        $accuracyPct = $quizTotal > 0 ? (int) floor($quizCorrect / $quizTotal * 100) : 0;

        $totalActiveLessons = Lesson::where('is_active', true)->count();
        $completedLessons = UserLessonProgress::where('user_id', $user->id)->where('status', 'completed')->count();
        $coveragePct = $totalActiveLessons > 0 ? (int) floor($completedLessons / $totalActiveLessons * 100) : 0;

        // --- Practice Time Breakdown ---
        $todayStart = now()->startOfDay();
        $weekStart = now()->startOfWeek();

        $practiceTime = [];
        foreach (['today' => $todayStart, 'week' => $weekStart, 'overall' => null] as $range => $from) {
            $lessonQ = LessonCompletionEvent::where('user_id', $user->id);
            $scenarioQ = ScenarioAttempt::where('user_id', $user->id);
            $flashcardQ = FlashcardReview::where('user_id', $user->id);
            $quizWrongQ = QuizQuestionAttempt::where('user_id', $user->id)->where('is_correct', false);

            if ($from) {
                $lessonQ->where('created_at', '>=', $from);
                $scenarioQ->where('created_at', '>=', $from);
                $flashcardQ->where('created_at', '>=', $from);
                $quizWrongQ->where('created_at', '>=', $from);
            }

            $learningSeconds = (int) $lessonQ->sum('duration_seconds');
            $typingSeconds = (int) $scenarioQ->sum('duration_seconds') + (int) $flashcardQ->sum('duration_seconds');
            $notPassedSeconds = (int) $quizWrongQ->sum('duration_seconds');
            $totalSeconds = $learningSeconds + $typingSeconds + $notPassedSeconds;

            $practiceTime[$range] = compact('learningSeconds', 'typingSeconds', 'notPassedSeconds', 'totalSeconds');
        }

        // --- Attempts Heatmap ---
        $todayAttempts = $this->collectAttemptTimestamps($user->id, $todayStart);
        $weekAttempts = $this->collectAttemptTimestamps($user->id, $weekStart);

        $todayCells = $this->fillHeatmapCells($todayAttempts, $todayStart->timestamp, 86400, 100);
        $weekCells = $this->fillHeatmapCells($weekAttempts, $weekStart->timestamp, 7 * 86400, 200);

        // --- Country Mastery ---
        $countryMastery = $this->buildCountryMastery($user->id);

        return [
            'xpLevel' => [
                'level' => $level,
                'xpCurrent' => $xpCurrent,
                'xpGoal' => 100,
            ],
            'accuracyCoverage' => [
                'accuracyPct' => $accuracyPct,
                'coveragePct' => $coveragePct,
            ],
            'practiceTime' => $practiceTime,
            'attempts' => [
                'today' => $todayCells,
                'week' => $weekCells,
            ],
            'countryMastery' => $countryMastery,
        ];
    }

    private function collectAttemptTimestamps(int $userId, $from): array
    {
        $times = [];

        foreach ([
            DB::table('quiz_question_attempts'),
            DB::table('scenario_attempts'),
            DB::table('flashcard_reviews'),
        ] as $query) {
            $rows = $query
                ->where('user_id', $userId)
                ->where('created_at', '>=', $from)
                ->pluck('created_at');

            foreach ($rows as $ts) {
                $times[] = is_numeric($ts) ? (int) $ts : strtotime($ts);
            }
        }

        return $times;
    }

    private function fillHeatmapCells(array $timestamps, int $periodStartTs, int $periodDurationSeconds, int $cellCount): array
    {
        $cells = array_fill(0, $cellCount, 0);
        $cellDuration = $periodDurationSeconds / $cellCount;

        foreach ($timestamps as $ts) {
            $offset = $ts - $periodStartTs;
            if ($offset < 0) {
                continue;
            }
            $index = (int) min(floor($offset / $cellDuration), $cellCount - 1);
            $cells[$index]++;
        }

        return $cells;
    }

    private function buildCountryMastery(int $userId): array
    {
        $countries = Country::active()
            ->whereNotNull('iso_code')
            ->with([
                'modules' => fn ($q) => $q->where('is_active', true)
                    ->with([
                        'lessons' => fn ($lq) => $lq->where('is_active', true)->select('id', 'module_id', 'type'),
                    ]),
            ])
            ->get();

        if ($countries->isEmpty()) {
            return [];
        }

        $allLessonIds = $countries
            ->flatMap(fn ($c) => $c->modules->flatMap(fn ($m) => $m->lessons->pluck('id')))
            ->unique()
            ->values()
            ->all();

        $progressMap = UserLessonProgress::where('user_id', $userId)
            ->whereIn('lesson_id', $allLessonIds)
            ->get()
            ->keyBy('lesson_id');

        // Quiz accuracy per lesson: get correct/total counts
        $quizStats = DB::table('quiz_question_attempts as qa')
            ->join('quiz_questions as qq', 'qa.quiz_question_id', '=', 'qq.id')
            ->where('qa.user_id', $userId)
            ->whereIn('qq.lesson_id', $allLessonIds)
            ->select('qq.lesson_id', DB::raw('COUNT(*) as total'), DB::raw('SUM(qa.is_correct) as correct'))
            ->groupBy('qq.lesson_id')
            ->get()
            ->keyBy('lesson_id');

        $result = [];

        foreach ($countries as $country) {
            $lessons = $country->modules->flatMap(fn ($m) => $m->lessons)->values();

            if ($lessons->isEmpty()) {
                continue;
            }

            $totalLessons = $lessons->count();
            $completedCount = $lessons->filter(
                fn ($l) => $progressMap->get($l->id)?->status === 'completed'
            )->count();

            $score = (int) round($completedCount / $totalLessons * 100);

            // Quiz recall score (0-10)
            $totalAttempts = 0;
            $correctAttempts = 0;
            foreach ($lessons as $lesson) {
                $stat = $quizStats->get($lesson->id);
                if ($stat) {
                    $totalAttempts += $stat->total;
                    $correctAttempts += $stat->correct;
                }
            }
            $recallScore = $totalAttempts > 0 ? (int) round($correctAttempts / $totalAttempts * 10) : 0;

            // Breakdown by lesson type → category
            $typeMap = ['article' => 'language', 'video' => 'landmarks', 'summary' => 'traditions'];
            $breakdown = ['language' => 0, 'landmarks' => 0, 'traditions' => 0];
            $breakdownCounts = ['language' => 0, 'landmarks' => 0, 'traditions' => 0];

            foreach ($lessons as $lesson) {
                $typeValue = $lesson->type instanceof \BackedEnum ? $lesson->type->value : (string) $lesson->type;
                $category = $typeMap[$typeValue] ?? null;
                if ($category === null) {
                    continue;
                }
                $breakdownCounts[$category]++;
                if ($progressMap->get($lesson->id)?->status === 'completed') {
                    $breakdown[$category]++;
                }
            }

            foreach ($breakdown as $cat => $completed) {
                $total = $breakdownCounts[$cat];
                $breakdown[$cat] = $total > 0 ? (int) round($completed / $total * 100) : $score;
            }

            $result[] = [
                'countryCode' => strtoupper($country->iso_code),
                'score' => $score,
                'recallScore' => $recallScore,
                'breakdown' => $breakdown,
            ];
        }

        return $result;
    }
}
