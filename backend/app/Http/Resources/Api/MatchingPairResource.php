<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MatchingPairResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'left_text' => $this->left_text,
            'right_text' => $this->right_text,
            'order' => $this->order,
            'is_active' => $this->is_active,
        ];
    }
}
