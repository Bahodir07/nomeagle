<?php

namespace App\Filament\Resources\Scenarios\Schemas;

use App\Models\Scenario;
use Filament\Forms\Components\Repeater;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ScenarioForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Scenario information')
                    ->description('Interactive situation and answer options.')
                    ->schema([
                        Select::make('lesson_id')
                            ->label('Lesson')
                            ->relationship('lesson', 'title')
                            ->searchable()
                            ->preload()
                            ->required(),

                        TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (?string $state, $set, $get, ?Scenario $record): void {
                                if (blank($state) || filled($get('slug'))) {
                                    return;
                                }

                                $lessonId = $get('lesson_id');

                                $scenario = $record ?? new Scenario([
                                    'lesson_id' => $lessonId,
                                ]);

                                $set('slug', $scenario->generateUniqueSlug($state));
                            }),

                        TextInput::make('slug')
                            ->required()
                            ->readOnly()
                            ->maxLength(255)
                            ->helperText('Unique inside this lesson.'),

                        TextInput::make('type')
                            ->default('decision')
                            ->required()
                            ->readOnly(),

                        Textarea::make('prompt')
                            ->required()
                            ->rows(6)
                            ->columnSpanFull()
                            ->placeholder('Describe the situation that the learner should respond to.'),

                        Repeater::make('payload.options')
                            ->label('Answer options')
                            ->columnSpanFull()
                            ->defaultItems(0)
                            ->minItems(2)
                            ->reorderable(false)
                            ->addActionLabel('Add option')
                            ->schema([
                                TextInput::make('id')
                                    ->label('Option ID')
                                    ->helperText('Example: accept-and-drink')
                                    ->maxLength(255),

                                Textarea::make('text')
                                    ->label('Option text')
                                    ->required()
                                    ->rows(2)
                                    ->columnSpanFull(),

                                Toggle::make('is_correct')
                                    ->label('Correct answer')
                                    ->default(false)
                                    ->inline(false),

                                Textarea::make('explanation')
                                    ->label('Explanation')
                                    ->rows(3)
                                    ->columnSpanFull()
                                    ->placeholder('Why is this option correct or incorrect?'),
                            ])
                            ->columns()
                            ->helperText('Create the answer choices shown to the learner.'),

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
                    ->columns(),
            ]);
    }
}
