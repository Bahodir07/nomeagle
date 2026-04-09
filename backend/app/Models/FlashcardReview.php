<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FlashcardReview extends Model
{
    protected $fillable = [
        'user_id',
        'flashcard_id',
        'rating',
        'xp_earned',
        'duration_seconds',
        'shown_at',
        'flipped_at',
        'reviewed_at',
    ];

    protected $casts = [
        'shown_at' => 'datetime',
        'flipped_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function flashcard(): BelongsTo
    {
        return $this->belongsTo(Flashcard::class);
    }
}
