<?php

namespace App\Filament\Resources\Scenarios;

use App\Filament\Resources\Scenarios\Pages\CreateScenario;
use App\Filament\Resources\Scenarios\Pages\EditScenario;
use App\Filament\Resources\Scenarios\Pages\ListScenarios;
use App\Filament\Resources\Scenarios\Schemas\ScenarioForm;
use App\Filament\Resources\Scenarios\Tables\ScenariosTable;
use App\Models\Scenario;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use UnitEnum;

class ScenarioResource extends Resource
{
    protected static ?string $model = Scenario::class;

    protected static string|null|UnitEnum $navigationGroup = 'Content';

    protected static ?int $navigationSort = 4;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-puzzle-piece';

    protected static ?string $modelLabel = 'Scenario';

    protected static ?string $pluralModelLabel = 'Scenarios';

    public static function form(Schema $schema): Schema
    {
        return ScenarioForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ScenariosTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListScenarios::route('/'),
            'create' => CreateScenario::route('/create'),
            'edit' => EditScenario::route('/{record}/edit'),
        ];
    }
}
