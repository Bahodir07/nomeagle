<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Scenario extends Model
{
    protected $fillable = [
        'lesson_id',
        'title',
        'slug',
        'type',
        'prompt',
        'payload',
        'order',
        'xp_reward',
        'is_active',
    ];

    protected $casts = [
        'payload' => 'array',
        'is_active' => 'boolean',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /*
     |--------------------------------
     | Relationships
     |--------------------------------
     */

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(ScenarioAttempt::class);
    }

    /*
     |--------------------------------
     | Scopes
     |--------------------------------
     */

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /*
     |--------------------------------
     | Slug Generator
     |--------------------------------
     */

    public function generateUniqueSlug(string $title): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $i = 2;

        while (
        static::query()
            ->where('lesson_id', $this->lesson_id)
            ->where('slug', $slug)
            ->when($this->exists, fn ($q) => $q->whereKeyNot($this->getKey()))
            ->exists()
        ) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }

    /*
     |--------------------------------
     | Payload Normalization
     |--------------------------------
     */

    public static function normalizePayloadArray(?array $payload): array
    {
        $payload ??= [];

        if (isset($payload['options']) && is_array($payload['options'])) {
            $options = collect($payload['options'])
                ->map(function ($option, int $index) {
                    $id = trim((string) ($option['id'] ?? ''));
                    $text = trim((string) ($option['text'] ?? $option['label'] ?? ''));
                    $explanation = trim((string) ($option['explanation'] ?? ''));
                    $isCorrect = filter_var($option['is_correct'] ?? false, FILTER_VALIDATE_BOOLEAN);

                    return [
                        'id' => $id !== '' ? $id : 'option-' . ($index + 1),
                        'text' => $text,
                        'is_correct' => (bool) $isCorrect,
                        'explanation' => $explanation !== '' ? $explanation : null,
                    ];
                })
                ->filter(fn (array $option) => $option['text'] !== '')
                ->values()
                ->all();

            return [
                'options' => $options,
            ];
        }

        $grouped = [];

        foreach ($payload as $key => $value) {
            if (! preg_match('/^options_(\d+)_(id|text|is_correct|explanation)$/', (string) $key, $matches)) {
                continue;
            }

            $index = (int) $matches[1];
            $field = $matches[2];

            $grouped[$index] ??= [
                'id' => null,
                'text' => null,
                'is_correct' => false,
                'explanation' => null,
            ];

            if ($field === 'is_correct') {
                $grouped[$index][$field] = filter_var($value, FILTER_VALIDATE_BOOLEAN);
            } else {
                $grouped[$index][$field] = is_string($value) ? trim($value) : $value;
            }
        }

        ksort($grouped);

        $options = collect($grouped)
            ->values()
            ->map(function (array $option, int $index) {
                $id = trim((string) ($option['id'] ?? ''));
                $text = trim((string) ($option['text'] ?? ''));
                $explanation = trim((string) ($option['explanation'] ?? ''));

                return [
                    'id' => $id !== '' ? $id : 'option-' . ($index + 1),
                    'text' => $text,
                    'is_correct' => (bool) ($option['is_correct'] ?? false),
                    'explanation' => $explanation !== '' ? $explanation : null,
                ];
            })
            ->filter(fn (array $option) => $option['text'] !== '')
            ->values()
            ->all();

        return [
            'options' => $options,
        ];
    }

    public function normalizedPayload(): array
    {
        return static::normalizePayloadArray($this->payload ?? []);
    }
}
