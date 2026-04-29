<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class QuizQuestionResource extends JsonResource
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
            'question' => $this->question,
            'image_url' => $this->question_image_path
                ? Storage::disk('s3')->url($this->question_image_path)
                : null,
            'image_alt' => $this->question_image_alt,
            'options' => $this->options,
            'explanation' => $this->explanation,
            'order' => $this->order,
            'xp_reward' => $this->xp_reward,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}

