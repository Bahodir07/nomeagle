<?php

namespace App\Filament\Resources\SummaryLessons\Pages;

use App\Filament\Resources\SummaryLessons\SummaryLessonResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSummaryLessons extends ListRecords
{
    protected static string $resource = SummaryLessonResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
