<?php

namespace App\Filament\Resources\SummaryLessons\Pages;

use App\Filament\Resources\SummaryLessons\SummaryLessonResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSummaryLesson extends EditRecord
{
    protected static string $resource = SummaryLessonResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
