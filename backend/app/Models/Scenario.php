<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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

    public function attempts()
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
}
