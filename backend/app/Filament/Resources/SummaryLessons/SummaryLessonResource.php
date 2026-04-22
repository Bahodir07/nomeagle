<?php

namespace App\Filament\Resources\SummaryLessons;

use App\Enums\LessonType;
use App\Filament\Resources\Lessons\Tables\LessonsTable;
use App\Filament\Resources\SummaryLessons\Pages\CreateSummaryLesson;
use App\Filament\Resources\SummaryLessons\Pages\EditSummaryLesson;
use App\Filament\Resources\SummaryLessons\Pages\ListSummaryLessons;
use App\Filament\Resources\SummaryLessons\Schemas\SummaryLessonForm;
use App\Models\Lesson;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use UnitEnum;

class SummaryLessonResource extends Resource
{
    protected static ?string $model = Lesson::class;

    protected static string|null|UnitEnum $navigationGroup = 'Lesson Content';
    protected static ?int $navigationSort = 12;
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-clipboard-document-list';

    protected static ?string $modelLabel = 'Summary lesson';
    protected static ?string $pluralModelLabel = 'Summary lessons';
    protected static ?string $navigationLabel = 'Summary Lessons';

    public static function form(Schema $schema): Schema
    {
        return SummaryLessonForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return LessonsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->where('type', LessonType::SUMMARY->value);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListSummaryLessons::route('/'),
            'create' => CreateSummaryLesson::route('/create'),
            'edit' => EditSummaryLesson::route('/{record}/edit'),
        ];
    }
}
