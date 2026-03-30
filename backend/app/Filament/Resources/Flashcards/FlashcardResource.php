<?php

namespace App\Filament\Resources\Flashcards;

use App\Filament\Resources\Flashcards\Pages\CreateFlashcard;
use App\Filament\Resources\Flashcards\Pages\EditFlashcard;
use App\Filament\Resources\Flashcards\Pages\ListFlashcards;
use App\Filament\Resources\Flashcards\Schemas\FlashcardForm;
use App\Filament\Resources\Flashcards\Tables\FlashcardsTable;
use App\Models\Flashcard;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use UnitEnum;

class FlashcardResource extends Resource
{
    protected static ?string $model = Flashcard::class;

    protected static string|null|UnitEnum $navigationGroup = 'Content';

    protected static ?int $navigationSort = 6;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $modelLabel = 'Flashcard';

    protected static ?string $pluralModelLabel = 'Flashcards';

    public static function form(Schema $schema): Schema
    {
        return FlashcardForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FlashcardsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListFlashcards::route('/'),
            'create' => CreateFlashcard::route('/create'),
            'edit' => EditFlashcard::route('/{record}/edit'),
        ];
    }
}
