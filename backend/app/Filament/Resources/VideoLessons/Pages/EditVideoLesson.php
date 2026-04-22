<?php

namespace App\Filament\Resources\VideoLessons\Pages;

use App\Filament\Resources\VideoLessons\VideoLessonResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditVideoLesson extends EditRecord
{
    protected static string $resource = VideoLessonResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
