<?php

namespace App\Filament\Resources\MatchingPairs;

use App\Filament\Resources\MatchingPairs\Pages\CreateMatchingPair;
use App\Filament\Resources\MatchingPairs\Pages\EditMatchingPair;
use App\Filament\Resources\MatchingPairs\Pages\ListMatchingPairs;
use App\Filament\Resources\MatchingPairs\Schemas\MatchingPairForm;
use App\Filament\Resources\MatchingPairs\Tables\MatchingPairsTable;
use App\Models\MatchingPair;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use UnitEnum;

class MatchingPairResource extends Resource
{
    protected static ?string $model = MatchingPair::class;

    protected static string|null|UnitEnum $navigationGroup = 'Content';

    protected static ?int $navigationSort = 7;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-arrows-right-left';

    protected static ?string $modelLabel = 'Matching Pair';

    protected static ?string $pluralModelLabel = 'Matching Pairs';

    public static function form(Schema $schema): Schema
    {
        return MatchingPairForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return MatchingPairsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListMatchingPairs::route('/'),
            'create' => CreateMatchingPair::route('/create'),
            'edit' => EditMatchingPair::route('/{record}/edit'),
        ];
    }
}
