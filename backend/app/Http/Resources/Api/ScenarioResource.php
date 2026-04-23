<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ScenarioResource extends JsonResource
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

            'title' => $this->title,
            'slug' => $this->slug,
            'type' => $this->type,
            'prompt' => $this->prompt,
            'image_url' => $this->image_path
                ? Storage::disk('public')->url($this->image_path)
                : null,
            'image_alt' => $this->image_alt,
            'payload' => $this->normalizedPayload(),
            'order' => $this->order,
            'xp_reward' => $this->xp_reward,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
