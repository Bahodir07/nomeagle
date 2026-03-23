<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LessonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'module' => [
                'id' => $this->module?->id,
                'title' => $this->module?->title,
                'slug' => $this->module?->slug,
            ],

            'title' => $this->title,
            'slug' => $this->slug,
            'type' => $this->type,

            'description' => $this->description,
            'content' => $this->content,

            'order' => $this->order,

            'xp_reward' => $this->xp_reward,
            'stars_reward' => $this->stars_reward,
            'estimated_minutes' => $this->estimated_minutes,

            'is_active' => $this->is_active,
        ];
    }
}
