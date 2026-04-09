<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LessonProgressResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'lesson_id' => $this->lesson_id,
            'status' => $this->status,
            'progress_pct' => $this->progress_pct,
            'total_items' => $this->total_items,
            'completed_items' => $this->completed_items,
            'correct_answers' => $this->correct_answers,
            'total_attempts' => $this->total_attempts,
            'xp_earned' => $this->xp_earned,
            'completed_at' => $this->completed_at?->toISOString(),
            'last_activity_at' => $this->last_activity_at?->toISOString(),
        ];
    }
}
