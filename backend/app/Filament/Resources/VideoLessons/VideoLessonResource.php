<?php

namespace App\Filament\Resources\VideoLessons;

use App\Enums\LessonType;
use App\Filament\Resources\Lessons\Tables\LessonsTable;
use App\Filament\Resources\VideoLessons\Pages\CreateVideoLesson;
use App\Filament\Resources\VideoLessons\Pages\EditVideoLesson;
use App\Filament\Resources\VideoLessons\Pages\ListVideoLessons;
use App\Filament\Resources\VideoLessons\Schemas\VideoLessonForm;
use App\Models\Lesson;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use UnitEnum;

class VideoLessonResource extends Resource
{
    protected static ?string $model = Lesson::class;

    protected static string|null|UnitEnum $navigationGroup = 'Lesson Content';
    protected static ?int $navigationSort = 10;
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-play-circle';

    protected static ?string $modelLabel = 'Video lesson';
    protected static ?string $pluralModelLabel = 'Video lessons';
    protected static ?string $navigationLabel = 'Video Lessons';

    public static function form(Schema $schema): Schema
    {
        return VideoLessonForm::configure($schema);
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
            ->where('type', LessonType::VIDEO->value);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListVideoLessons::route('/'),
            'create' => CreateVideoLesson::route('/create'),
            'edit' => EditVideoLesson::route('/{record}/edit'),
        ];
    }
}
