<?php

namespace App\Filament\Resources\VideoLessons\Pages;

use App\Filament\Resources\VideoLessons\VideoLessonResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListVideoLessons extends ListRecords
{
    protected static string $resource = VideoLessonResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
