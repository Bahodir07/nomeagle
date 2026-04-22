<?php

namespace App\Filament\Resources\ArticleLessons\Pages;

use App\Filament\Resources\ArticleLessons\ArticleLessonResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListArticleLessons extends ListRecords
{
    protected static string $resource = ArticleLessonResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
