<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class CompleteLessonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'duration_seconds' => ['nullable', 'integer', 'min:0'],
            'correct_answers'  => ['nullable', 'integer', 'min:0'],
            'total_attempts'   => ['nullable', 'integer', 'min:0'],
        ];
    }
}
