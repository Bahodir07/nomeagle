<?php

namespace App\Filament\Resources\Flashcards\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class FlashcardForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Flashcard information')
                    ->description('Front and back content for the learning card.')
                    ->schema([
                        Select::make('lesson_id')
                            ->label('Lesson')
                            ->relationship('lesson', 'title')
                            ->searchable()
                            ->preload()
                            ->required()
                            ->hiddenOn(\App\Filament\Resources\Lessons\RelationManagers\FlashcardsRelationManager::class),

                        Textarea::make('front_text')
                            ->label('Front text')
                            ->required()
                            ->rows(4)
                            ->columnSpanFull()
                            ->placeholder('Word, phrase, question, or concept...'),

                        Textarea::make('back_text')
                            ->label('Back text')
                            ->required()
                            ->rows(4)
                            ->columnSpanFull()
                            ->placeholder('Translation, answer, explanation...'),

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
