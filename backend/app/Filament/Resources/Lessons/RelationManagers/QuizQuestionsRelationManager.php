<?php

namespace App\Filament\Resources\Lessons\RelationManagers;

use App\Filament\Resources\QuizQuestions\QuizQuestionResource;
use Filament\Actions\CreateAction;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Table;

class QuizQuestionsRelationManager extends RelationManager
{
    protected static string $relationship = 'quizQuestions';

    protected static ?string $relatedResource = QuizQuestionResource::class;

    public function table(Table $table): Table
    {
        return $table
            ->headerActions([
                CreateAction::make(),
            ]);
    }
}
