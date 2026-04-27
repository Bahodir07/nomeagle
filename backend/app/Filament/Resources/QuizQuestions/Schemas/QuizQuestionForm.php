<?php

namespace App\Filament\Resources\QuizQuestions\Schemas;

use App\Enums\LessonType;
use App\Models\Lesson;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class QuizQuestionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Quiz question')
                    ->description('Question, answer options, explanation and rewards.')
                    ->schema([
                        Select::make('lesson_id')
                            ->label('Lesson')
                            ->options(fn () => Lesson::query()
                                ->where('type', LessonType::QUIZ)
                                ->with(['module.country'])
                                ->orderBy('title')
                                ->get()
                                ->groupBy(fn ($l) => $l->module->country->name . ' › ' . $l->module->title)
                                ->map(fn ($lessons) => $lessons->pluck('title', 'id'))
                                ->toArray()
                            )
                            ->searchable()
                            ->required()
                            ->hiddenOn(\App\Filament\Resources\Lessons\RelationManagers\QuizQuestionsRelationManager::class),

                        Textarea::make('question')
                            ->required()
                            ->rows(4)
                            ->columnSpanFull()
                            ->placeholder('Enter the quiz question...'),

                        FileUpload::make('question_image_path')
                            ->label('Question image')
                            ->image()
                            ->disk('public')
                            ->directory('quiz-question-images')
                            ->columnSpanFull(),

                        TextInput::make('question_image_alt')
                            ->label('Image alt text')
                            ->maxLength(255)
                            ->columnSpanFull(),

                        Repeater::make('options')
                            ->label('Answer options')
                            ->required()
                            ->minItems(2)
                            ->defaultItems(3)
                            ->columnSpanFull()
                            ->schema([
                                TextInput::make('id')
                                    ->label('Option ID')
                                    ->required()
                                    ->maxLength(10)
                                    ->placeholder('a'),

                                TextInput::make('text')
                                    ->label('Option text')
                                    ->required()
                                    ->maxLength(255)
                                    ->columnSpanFull(),

                                Toggle::make('is_correct')
                                    ->label('Correct answer')
                                    ->default(false)
                                    ->inline(false),
                            ])
                            ->columns(2)
                            ->helperText('Mark only one option as correct.'),

                        Textarea::make('explanation')
                            ->rows(4)
                            ->columnSpanFull()
                            ->placeholder('Explain why the correct answer is correct...'),

                        TextInput::make('order')
                            ->numeric()
                            ->required()
                            ->default(1)
                            ->minValue(1),

                        TextInput::make('xp_reward')
                            ->label('XP reward')
                            ->numeric()
                            ->required()
                            ->default(0)
                            ->minValue(0),

                        Toggle::make('is_active')
                            ->label('Active')
                            ->default(true)
                            ->inline(false),
                    ])
                    ->columns(2),
            ]);
    }
}
