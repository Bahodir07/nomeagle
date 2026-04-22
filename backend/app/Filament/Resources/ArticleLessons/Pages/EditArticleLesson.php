<?php

namespace App\Filament\Resources\ArticleLessons\Pages;

use App\Filament\Resources\ArticleLessons\ArticleLessonResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditArticleLesson extends EditRecord
{
    protected static string $resource = ArticleLessonResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
