<?php

namespace App\Filament\Resources\MatchingPairs\Schemas;

use App\Enums\LessonType;
use App\Models\Lesson;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class MatchingPairForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Matching pair')
                    ->description('Left and right items that the learner must connect.')
                    ->schema([
                        Select::make('lesson_id')
                            ->label('Lesson')
                            ->options(fn () => Lesson::query()
                                ->where('type', LessonType::MATCHING)
                                ->with(['module.country'])
                                ->orderBy('title')
                                ->get()
                                ->groupBy(fn ($l) => $l->module->country->name . ' › ' . $l->module->title)
                                ->map(fn ($lessons) => $lessons->pluck('title', 'id'))
                                ->toArray()
                            )
                            ->searchable()
                            ->required()
                            ->hiddenOn(\App\Filament\Resources\Lessons\RelationManagers\MatchingPairsRelationManager::class),

                        Textarea::make('left_text')
                            ->label('Left item')
                            ->required()
                            ->rows(3)
                            ->columnSpanFull()
                            ->placeholder('Word, phrase, or concept on the left side…'),

                        Textarea::make('right_text')
                            ->label('Right item')
                            ->required()
                            ->rows(3)
                            ->columnSpanFull()
                            ->placeholder('Matching translation, definition, or answer…'),

                        TextInput::make('order')
                            ->numeric()
                            ->required()
                            ->default(1)
                            ->minValue(1),

                        Toggle::make('is_active')
                            ->label('Active')
                            ->default(true)
                            ->inline(false),
                    ])
                    ->columns(2),
            ]);
    }
}
