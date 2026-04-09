<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Flashcard extends Model
{
    protected $fillable = [
        'lesson_id',
        'front_text',
        'back_text',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(FlashcardReview::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
