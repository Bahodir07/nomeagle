<?php

namespace App\Filament\Widgets;

use App\Models\Country;
use App\Models\Module;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Countries', Country::count())
                ->description('All countries'),

            Stat::make('Modules', Module::count())
                ->description('All modules'),

            Stat::make('Users', User::count())
                ->description('Registered users'),
        ];
    }
}
