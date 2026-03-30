<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FlashcardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'lesson' => [
                'id' => $this->lesson?->id,
                'title' => $this->lesson?->title,
                'slug' => $this->lesson?->slug,
            ],
            'front_text' => $this->front_text,
            'back_text' => $this->back_text,
            'order' => $this->order,
            'is_active' => $this->is_active,
        ];
    }
}
