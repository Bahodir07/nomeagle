<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizQuestion extends Model
{
    protected $fillable = [
        'lesson_id',
        'question',
        'options',
        'explanation',
        'order',
        'xp_reward',
        'is_active',
    ];

    protected $casts = [
        'options' => 'array',
        'is_active' => 'boolean',
    ];

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function attempts()
    {
        return $this->hasMany(QuizQuestionAttempt::class);
    }

    public function getRouteKeyName(): string
    {
        return 'id';
    }
}
