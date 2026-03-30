<?php

namespace App\Filament\Resources\QuizQuestions\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class QuizQuestionInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('lesson.title')
                    ->label('Lesson'),
                TextEntry::make('question')
                    ->columnSpanFull(),
                TextEntry::make('explanation')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('order')
                    ->numeric(),
                TextEntry::make('xp_reward')
                    ->numeric(),
                IconEntry::make('is_active')
                    ->boolean(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
