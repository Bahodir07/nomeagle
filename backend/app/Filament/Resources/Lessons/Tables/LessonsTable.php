<?php

namespace App\Filament\Resources\Lessons\Tables;

use App\Enums\LessonType;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Grouping\Group;
use Filament\Tables\Table;

class LessonsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('order')
            ->groups([
                Group::make('module.country.name')
                    ->label('Country')
                    ->collapsible(),

                Group::make('module.title')
                    ->label('Module')
                    ->collapsible(),
            ])
            ->defaultGroup('module.country.name')
            ->columns([
                TextColumn::make('module.country.name')
                    ->label('Country')
                    ->sortable()
                    ->searchable()
                    ->toggleable(),

                TextColumn::make('module.title')
                    ->label('Module')
                    ->sortable()
                    ->searchable()
                    ->toggleable(),

                TextColumn::make('order')
                    ->badge()
                    ->sortable(),

                TextColumn::make('title')
                    ->label('Lesson')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                TextColumn::make('type')
                    ->badge()
                    ->formatStateUsing(function ($state) {
                        if ($state instanceof LessonType) {
                            return $state->label();
                        }

                        return LessonType::from($state)->label();
                    }),

                TextColumn::make('xp_reward')
                    ->label('XP')
                    ->sortable(),

                TextColumn::make('estimated_minutes')
                    ->label('Min')
                    ->sortable()
                    ->toggleable(),

                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean()
                    ->sortable(),

                TextColumn::make('slug')
                    ->copyable()
                    ->color('gray')
                    ->toggleable(isToggledHiddenByDefault: true),

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
                SelectFilter::make('country')
                    ->relationship('module.country', 'name'),

                SelectFilter::make('module')
                    ->relationship('module', 'title'),

                SelectFilter::make('type')
                    ->options(LessonType::options()),

                TernaryFilter::make('is_active')
                    ->label('Active status')
                    ->placeholder('All lessons')
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
