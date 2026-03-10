<?php

namespace App\Filament\Resources\Countries\Tables;

use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class CountriesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                ImageColumn::make('flag_path')
                    ->label('Flag')
                    ->disk('public')
                    ->circular(false)
                    ->square()
                    ->size(48)
                    ->defaultImageUrl(url('https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg')),

                TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                TextColumn::make('slug')
                    ->searchable()
                    ->copyable()
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->color('gray'),

                TextColumn::make('region')
                    ->badge()
                    ->sortable(),

                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean()
                    ->sortable(),

                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('updated_at')
                    ->label('Updated')
                    ->since()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('region')
                    ->options([
                        'Asia' => 'Asia',
                        'Europe' => 'Europe',
                        'Africa' => 'Africa',
                        'North America' => 'North America',
                        'South America' => 'South America',
                        'Oceania' => 'Oceania',
                    ]),

                TernaryFilter::make('is_active')
                    ->label('Active status')
                    ->placeholder('All countries')
                    ->trueLabel('Only active')
                    ->falseLabel('Only inactive'),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                DeleteBulkAction::make(),
            ]);
    }
}
