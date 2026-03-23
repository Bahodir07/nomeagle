<?php

namespace App\Enums;

enum LessonType: string
{
    case VIDEO = 'video';
    case ARTICLE = 'article';
    case FLASHCARDS = 'flashcards';
    case QUIZ = 'quiz';
    case SCENARIO = 'scenario';
    case SUMMARY = 'summary';

    public function label(): string
    {
        return match ($this) {
            self::VIDEO => 'Video',
            self::ARTICLE => 'Article',
            self::FLASHCARDS => 'Flashcards',
            self::QUIZ => 'Quiz',
            self::SCENARIO => 'Scenario',
            self::SUMMARY => 'Summary',
        };
    }

    public static function options(): array
    {
        return collect(self::cases())
            ->mapWithKeys(fn (self $type) => [$type->value => $type->label()])
            ->all();
    }
}
