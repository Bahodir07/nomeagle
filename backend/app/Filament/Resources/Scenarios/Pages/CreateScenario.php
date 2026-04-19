<?php

namespace App\Filament\Resources\Scenarios\Pages;

use App\Filament\Resources\Scenarios\ScenarioResource;
use App\Models\Scenario;
use Filament\Resources\Pages\CreateRecord;

class CreateScenario extends CreateRecord
{
    protected static string $resource = ScenarioResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['payload'] = Scenario::normalizePayloadArray($data['payload'] ?? []);

        return $data;
    }
}
