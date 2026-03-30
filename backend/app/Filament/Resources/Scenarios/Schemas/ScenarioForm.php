<?php

namespace App\Filament\Resources\Scenarios\Schemas;

use App\Models\Scenario;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
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

                        KeyValue::make('payload')
                            ->columnSpanFull()
                            ->keyLabel('Key')
                            ->valueLabel('Value')
                            ->helperText('Temporary payload editor. Example: options_1_text, options_1_is_correct, options_1_explanation.'),

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
