<?php

namespace App\Filament\Resources\MatchingPairs\Pages;

use App\Filament\Resources\MatchingPairs\MatchingPairResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListMatchingPairs extends ListRecords
{
    protected static string $resource = MatchingPairResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
