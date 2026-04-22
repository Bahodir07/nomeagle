<?php

namespace App\Filament\Resources\ArticleLessons;

use App\Enums\LessonType;
use App\Filament\Resources\ArticleLessons\Pages\CreateArticleLesson;
use App\Filament\Resources\ArticleLessons\Pages\EditArticleLesson;
use App\Filament\Resources\ArticleLessons\Pages\ListArticleLessons;
use App\Filament\Resources\ArticleLessons\Schemas\ArticleLessonForm;
use App\Filament\Resources\Lessons\Tables\LessonsTable;
use App\Models\Lesson;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use UnitEnum;

class ArticleLessonResource extends Resource
{
    protected static ?string $model = Lesson::class;

    protected static string|null|UnitEnum $navigationGroup = 'Lesson Content';
    protected static ?int $navigationSort = 11;
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $modelLabel = 'Article lesson';
    protected static ?string $pluralModelLabel = 'Article lessons';
    protected static ?string $navigationLabel = 'Article Lessons';

    public static function form(Schema $schema): Schema
    {
        return ArticleLessonForm::configure($schema);
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
            ->where('type', LessonType::ARTICLE->value);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListArticleLessons::route('/'),
            'create' => CreateArticleLesson::route('/create'),
            'edit' => EditArticleLesson::route('/{record}/edit'),
        ];
    }
}
