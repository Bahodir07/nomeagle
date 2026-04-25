<?php

namespace App\Filament\Resources\MatchingPairs\Pages;

use App\Filament\Resources\MatchingPairs\MatchingPairResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditMatchingPair extends EditRecord
{
    protected static string $resource = MatchingPairResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
