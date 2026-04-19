<?php

namespace App\Filament\Resources\Scenarios\Pages;

use App\Filament\Resources\Scenarios\ScenarioResource;
use App\Models\Scenario;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditScenario extends EditRecord
{
    protected static string $resource = ScenarioResource::class;

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $data['payload'] = Scenario::normalizePayloadArray($data['payload'] ?? []);

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $data['payload'] = Scenario::normalizePayloadArray($data['payload'] ?? []);

        return $data;
    }

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
