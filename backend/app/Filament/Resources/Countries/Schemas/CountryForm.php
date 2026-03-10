<?php

namespace App\Filament\Resources\Countries\Schemas;

use App\Models\Country;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;


class CountryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Country information')
                    ->description('Basic content and visibility settings for the country.')
                    ->schema([
                        TextInput::make('name')
                            ->label('Country name')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (?string $state, $set, $get, ?Country $record) {
                                if (blank($state)) {
                                    return;
                                }

                                $country = $record ?? new Country();

                                $set('slug', $country->generateUniqueSlug($state));
                            }),

                        TextInput::make('slug')
                            ->required()
                            ->disabled()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true)
                            ->helperText('Used in URLs, for example: /countries/japan'),

                        Select::make('region')
                            ->required()
                            ->searchable()
                            ->options([
                                'Asia' => 'Asia',
                                'Europe' => 'Europe',
                                'Africa' => 'Africa',
                                'North America' => 'North America',
                                'South America' => 'South America',
                                'Oceania' => 'Oceania',
                            ]),

                        Textarea::make('description')
                            ->rows(8)
                            ->columnSpanFull()
                            ->placeholder('Write a short cultural and educational description of the country...'),

                        FileUpload::make('flag_path')
                            ->label('Flag')
                            ->image()
                            ->imageEditor()
                            ->directory('flags')
                            ->disk('public')
                            ->visibility('public')
                            ->imagePreviewHeight('120')
                            ->helperText('Upload the country flag image.'),

                        Toggle::make('is_active')
                            ->label('Active')
                            ->default(true)
                            ->inline(false)
                            ->helperText('Only active countries should be visible in the public app.'),
                    ])
                    ->columns(),
            ]);
    }
}
