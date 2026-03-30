<?php

namespace App\Filament\Resources\Lessons\RelationManagers;

use App\Filament\Resources\Flashcards\FlashcardResource;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Table;

class FlashcardsRelationManager extends RelationManager
{
    protected static string $relationship = 'flashcards';

    protected static ?string $recordTitleAttribute = 'front_text';

    public function form(Schema $schema): Schema
    {
        return FlashcardResource::form($schema);
    }

    public function table(Table $table): Table
    {
        return FlashcardResource::table($table)
            ->headerActions([
                CreateAction::make(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                DeleteBulkAction::make(),
            ]);
    }
}
