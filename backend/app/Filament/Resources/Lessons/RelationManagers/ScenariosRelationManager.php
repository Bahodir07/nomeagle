<?php

namespace App\Filament\Resources\Lessons\RelationManagers;

use App\Filament\Resources\Scenarios\ScenarioResource;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Table;

class ScenariosRelationManager extends RelationManager
{
    protected static string $relationship = 'scenarios';

    protected static ?string $recordTitleAttribute = 'title';

    public function form(Schema $schema): Schema
    {
        return ScenarioResource::form($schema);
    }

    public function table(Table $table): Table
    {
        return ScenarioResource::table($table)
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
