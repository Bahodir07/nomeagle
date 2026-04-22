<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class ReviewFlashcardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rating'           => ['required', 'in:again,good,easy'],
            'shown_at'         => ['nullable', 'date'],
            'flipped_at'       => ['nullable', 'date'],
            'duration_seconds' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
