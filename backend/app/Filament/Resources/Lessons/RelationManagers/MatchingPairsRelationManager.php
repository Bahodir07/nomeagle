<?php

namespace App\Filament\Resources\Lessons\RelationManagers;

use App\Filament\Resources\MatchingPairs\MatchingPairResource;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Table;

class MatchingPairsRelationManager extends RelationManager
{
    protected static string $relationship = 'matchingPairs';

    protected static ?string $recordTitleAttribute = 'left_text';

    public function form(Schema $schema): Schema
    {
        return MatchingPairResource::form($schema);
    }

    public function table(Table $table): Table
    {
        return MatchingPairResource::table($table)
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
