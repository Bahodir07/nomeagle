<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\UserLessonProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LearningPathController extends Controller
{
    public function show(Request $request, Country $country): JsonResponse
    {
        abort_unless($country->is_active, 404);

        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Authentication required for learning path.',
            ], 401);
        }

        $country->load([
            'modules' => fn ($query) => $query
                ->where('is_active', true)
                ->orderBy('order')
                ->with([
                    'lessons' => fn ($lessonQuery) => $lessonQuery
                        ->where('is_active', true)
                        ->orderBy('order'),
                ]),
        ]);

        $allLessons = $country->modules
            ->flatMap(fn ($module) => $module->lessons)
            ->values();

        $progressRows = UserLessonProgress::query()
            ->where('user_id', $user->id)
            ->whereIn('lesson_id', $allLessons->pluck('id'))
            ->get()
            ->keyBy('lesson_id');

        $modulesPayload = [];
        $lessonsPayload = [];
        $completedLessonIds = [];
        $starsByLessonId = [];
        $lastOpenedLessonId = null;
        $lastOpenedAt = null;

        $globalLessonIndex = 1;
        $countryCode = $this->mapCountryCode($country->slug);

        foreach ($country->modules as $moduleIndex => $module) {
            $moduleUiId = sprintf('%s-m%d', $countryCode, $moduleIndex + 1);
            $moduleLessonIds = [];
            $moduleFirstIndex = $globalLessonIndex;

            foreach ($module->lessons as $lesson) {
                $lessonUiId = sprintf('%s-l%d', $countryCode, $globalLessonIndex);
                $rawProgress = $progressRows->get($lesson->id);

                /** @var UserLessonProgress|null $progress */
                $progress = $rawProgress instanceof UserLessonProgress ? $rawProgress : null;

                if ($progress?->status === 'completed') {
                    $completedLessonIds[] = $lessonUiId;
                }

                $stars = $this->resolveStars($lesson->type?->value ?? (string) $lesson->type, $progress);
                if ($stars > 0) {
                    $starsByLessonId[$lessonUiId] = $stars;
                }

                if (
                    $progress?->last_activity_at &&
                    $progress?->status !== 'completed' &&
                    ($lastOpenedAt === null || $progress->last_activity_at->gt($lastOpenedAt))
                ) {
                    $lastOpenedAt = $progress->last_activity_at;
                    $lastOpenedLessonId = $lessonUiId;
                }

                $lessonType = $lesson->type?->value ?? (string) $lesson->type;

                $lessonsPayload[$lessonUiId] = [
                    'id' => $lessonUiId,
                    'db_id' => $lesson->id,
                    'slug' => $lesson->slug,
                    'moduleId' => $moduleUiId,
                    'moduleSlug' => $module->slug,
                    'index' => $globalLessonIndex,
                    'type' => $lessonType,
                    'title' => $lesson->title,
                    'shortLabel' => $this->makeShortLabel($lessonType, $lesson->title),
                    'status' => $progress?->status === 'completed' ? 'completed' : 'locked',
                    'xpReward' => (int) $lesson->xp_reward,
                    'estimatedMinutes' => $lesson->estimated_minutes ? (int) $lesson->estimated_minutes : null,
                ];

                $moduleLessonIds[] = $lessonUiId;
                $globalLessonIndex++;
            }

            $moduleLastIndex = max($moduleFirstIndex, $globalLessonIndex - 1);

            $modulesPayload[] = [
                'id' => $moduleUiId,
                'db_id' => $module->id,
                'slug' => $module->slug,
                'title' => $module->title,
                'rangeLabel' => $moduleFirstIndex === $moduleLastIndex
                    ? (string) $moduleFirstIndex
                    : "{$moduleFirstIndex} - {$moduleLastIndex}",
                'lessonIds' => $moduleLessonIds,
            ];
        }

        $totalLessons = count($lessonsPayload);
        $completedCount = count($completedLessonIds);
        $progressPct = $totalLessons > 0
            ? (int) round(($completedCount / $totalLessons) * 100)
            : 0;

        $starsTotal = array_sum($starsByLessonId);

        $pointsTotal = collect($completedLessonIds)
            ->sum(function (string $lessonUiId) use ($lessonsPayload) {
                return (int) ($lessonsPayload[$lessonUiId]['xpReward'] ?? 0);
            });

        return response()->json([
            'course' => [
                'countryCode' => $countryCode,
                'countrySlug' => $country->slug,
                'countryName' => $country->name,
                'flagPath' => $country->flag_path,
                'flagUrl' => $country->flag_path
                    ? Storage::disk('public')->url($country->flag_path)
                    : null,
                'flagEmoji' => $this->getFlagEmoji($country->slug),

                'totalLessons' => $totalLessons,
                'progressPct' => $progressPct,
                'starsTotal' => $starsTotal,
                'pointsTotal' => $pointsTotal,

                'modules' => $modulesPayload,
                'lessons' => $lessonsPayload,
            ],

            'progress' => [
                'completedLessonIds' => $completedLessonIds,
                'starsByLessonId' => $starsByLessonId,
                'lastOpenedLessonId' => $lastOpenedLessonId,
            ],
        ]);
    }

    private function makeShortLabel(string $lessonType, string $title): string
    {
        $label = match ($lessonType) {
            'video' => 'Video',
            'article' => 'Article',
            'flashcards' => 'Flashcards',
            'quiz' => 'Quiz',
            'scenario' => 'Scenario',
            'summary' => 'Summary',
            'matching' => 'Matching',
            'open_response' => 'Open Response',
            default => ucfirst(str_replace('_', ' ', $lessonType)),
        };

        return "{$label}: {$title}";
    }

    private function resolveStars(string $lessonType, ?UserLessonProgress $progress): int
    {
        if (! $progress || $progress->status !== 'completed') {
            return 0;
        }

        if (in_array($lessonType, ['video', 'article', 'summary'], true)) {
            return 0;
        }

        $attempts = max((int) $progress->total_attempts, 0);
        $correct = max((int) $progress->correct_answers, 0);

        if ($attempts <= 0) {
            return 3;
        }

        $ratio = $correct / max($attempts, 1);

        return match (true) {
            $ratio >= 0.95 => 5,
            $ratio >= 0.80 => 4,
            $ratio >= 0.60 => 3,
            $ratio >= 0.40 => 2,
            default => 1,
        };
    }

    private function mapCountryCode(string $slug): string
    {
        return match ($slug) {
            'japan' => 'jp',
            'kazakhstan' => 'kz',
            'germany' => 'de',
            'france' => 'fr',
            'italy' => 'it',
            'brazil' => 'br',
            'china' => 'cn',
            'turkey' => 'tr',
            'south-korea', 'korea' => 'kr',
            'usa', 'united-states' => 'us',
            default => $slug,
        };
    }

    private function getFlagEmoji(string $slug): string
    {
        return match ($slug) {
            'japan' => '🇯🇵',
            'kazakhstan' => '🇰🇿',
            'germany' => '🇩🇪',
            'france' => '🇫🇷',
            'italy' => '🇮🇹',
            'brazil' => '🇧🇷',
            'china' => '🇨🇳',
            'turkey' => '🇹🇷',
            'south-korea', 'korea' => '🇰🇷',
            'usa', 'united-states' => '🇺🇸',
            default => '🏳️',
        };
    }
}
