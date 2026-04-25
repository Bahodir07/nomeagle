<?php

namespace App\Filament\Resources\MatchingPairs\Tables;

use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Grouping\Group;
use Filament\Tables\Table;

class MatchingPairsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('order')
            ->groups([
                Group::make('lesson.module.country.name')
                    ->label('Country')
                    ->collapsible(),

                Group::make('lesson.module.title')
                    ->label('Module')
                    ->collapsible(),

                Group::make('lesson.title')
                    ->label('Lesson')
                    ->collapsible(),
            ])
            ->defaultGroup('lesson.module.country.name')
            ->columns([
                TextColumn::make('lesson.module.country.name')
                    ->label('Country')
                    ->toggleable(),

                TextColumn::make('lesson.module.title')
                    ->label('Module')
                    ->toggleable(),

                TextColumn::make('lesson.title')
                    ->label('Lesson')
                    ->toggleable(),

                TextColumn::make('order')
                    ->badge()
                    ->sortable(),

                TextColumn::make('left_text')
                    ->label('Left')
                    ->searchable()
                    ->limit(60)
                    ->wrap()
                    ->weight('bold'),

                TextColumn::make('right_text')
                    ->label('Right')
                    ->limit(60)
                    ->wrap(),

                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean()
                    ->sortable(),

                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->toggleable(),
            ])
            ->filters([
                SelectFilter::make('lesson')
                    ->relationship('lesson', 'title'),

                TernaryFilter::make('is_active')
                    ->label('Active status')
                    ->placeholder('All pairs')
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
