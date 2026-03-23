<?php

namespace App\Filament\Resources\Modules\Schemas;

use App\Models\Module;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ModuleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Module information')
                    ->description('Structure and visibility settings for this module.')
                    ->schema([

                        Select::make('country_id')
                            ->label('Country')
                            ->relationship('country', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),

                        TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (?string $state, $set, $get, ?Module $record) {

                                if (blank($state) || filled($get('slug'))) {
                                    return;
                                }

                                $countryId = $get('country_id');

                                $module = $record ?? new Module([
                                    'country_id' => $countryId,
                                ]);

                                $set('slug', $module->generateUniqueSlug($state));
                            }),

                        TextInput::make('slug')
                            ->required()
                            ->readOnly()
                            ->maxLength(255)
                            ->helperText('Unique inside this country.'),

                        Textarea::make('description')
                            ->rows(6)
                            ->columnSpanFull(),

                        TextInput::make('order')
                            ->numeric()
                            ->required()
                            ->default(1)
                            ->minValue(1),

                        Toggle::make('is_active')
                            ->label('Active')
                            ->default(true)
                            ->inline(false),

                    ])
                    ->columns(2),
            ]);
    }
}
