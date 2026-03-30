<?php

namespace App\Filament\Resources\Scenarios\Pages;

use App\Filament\Resources\Scenarios\ScenarioResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewScenario extends ViewRecord
{
    protected static string $resource = ScenarioResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
