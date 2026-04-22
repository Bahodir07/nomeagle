<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class SubmitQuizQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'answer'           => ['required', 'string'],
            'duration_seconds' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
