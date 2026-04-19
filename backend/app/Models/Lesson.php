<?php

namespace App\Models;

use App\Enums\LessonType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Lesson extends Model
{
    protected $fillable = [
        'module_id',
        'title',
        'slug',
        'type',
        'description',
        'content',
        'video_source',
        'video_file',
        'external_video_url',
        'video_disk',
        'order',
        'xp_reward',
        'stars_reward',
        'estimated_minutes',
        'is_active',
    ];

    protected $casts = [
        'type' => LessonType::class,
        'content' => 'array',
        'is_active' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function scenarios(): HasMany
    {
        return $this->hasMany(Scenario::class)->orderBy('order');
    }

    public function quizQuestions(): HasMany
    {
        return $this->hasMany(QuizQuestion::class)->orderBy('order');
    }

    public function progress(): HasMany
    {
        return $this->hasMany(UserLessonProgress::class);
    }

    public function flashcards(): HasMany
    {
        return $this->hasMany(Flashcard::class)->orderBy('order');
    }

    public function completionEvents(): HasMany
    {
        return $this->hasMany(LessonCompletionEvent::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('order');
    }

    /*
    |--------------------------------------------------------------------------
    | Slug generation
    |--------------------------------------------------------------------------
    */

    public function generateUniqueSlug(string $title): string
    {
        $base = Str::slug($title);

        if (blank($base)) {
            $base = 'lesson';
        }

        $slug = $base;
        $i = 2;

        while (
        static::query()
            ->where('module_id', $this->module_id)
            ->where('slug', $slug)
            ->when($this->exists, fn ($query) => $query->whereKeyNot($this->getKey()))
            ->exists()
        ) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
