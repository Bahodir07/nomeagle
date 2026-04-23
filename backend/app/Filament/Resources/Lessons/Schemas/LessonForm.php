<?php

namespace App\Filament\Resources\Lessons\Schemas;

use App\Enums\LessonType;
use App\Models\Lesson;
use App\Models\Country;
use App\Models\Module;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class LessonForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Lesson information')
                    ->description('Basic lesson content and gamification settings.')
                    ->schema([
                        Select::make('module_id')
                            ->label('Module')
                            ->required()
                            ->searchable()
                            ->options(function (): array {
                                return Country::query()
                                    ->with(['modules' => fn ($q) => $q->orderBy('order')])
                                    ->orderBy('name')
                                    ->get()
                                    ->mapWithKeys(fn (Country $country) => [
                                        $country->name => $country->modules
                                            ->pluck('title', 'id')
                                            ->all(),
                                    ])
                                    ->all();
                            })
                            ->getSearchResultsUsing(function (string $search): array {
                                return Country::query()
                                    ->with(['modules' => fn ($q) => $q->where('title', 'like', "%{$search}%")->orderBy('order')])
                                    ->orderBy('name')
                                    ->get()
                                    ->mapWithKeys(fn (Country $country) => [
                                        $country->name => $country->modules
                                            ->pluck('title', 'id')
                                            ->all(),
                                    ])
                                    ->filter(fn (array $opts) => count($opts) > 0)
                                    ->all();
                            })
                            ->getOptionLabelUsing(fn ($value): ?string => Module::with('country')->find($value)?->title)
                            ->hiddenOn(\App\Filament\Resources\Modules\RelationManagers\LessonsRelationManager::class),

                        TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (?string $state, $set, $get, ?Lesson $record): void {
                                if (blank($state) || filled($get('slug'))) {
                                    return;
                                }

                                $moduleId = $get('module_id');

                                $lesson = $record ?? new Lesson([
                                    'module_id' => $moduleId,
                                ]);

                                $set('slug', $lesson->generateUniqueSlug($state));
                            }),

                        TextInput::make('slug')
                            ->required()
                            ->readOnly()
                            ->maxLength(255)
                            ->helperText('Unique inside this module.'),

                        Select::make('type')
                            ->required()
                            ->options(LessonType::options())
                            ->native(false),

                        Textarea::make('description')
                            ->rows(4)
                            ->columnSpanFull()
                            ->placeholder('Short description for the lesson card or preview.'),

                        KeyValue::make('content')
                            ->keyLabel('Key')
                            ->valueLabel('Value')
                            ->columnSpanFull()
                            ->helperText('Temporary payload editor. Later we can replace this with dynamic fields by lesson type.'),

                        TextInput::make('order')
                            ->numeric()
                            ->required()
                            ->default(1)
                            ->minValue(1),

                        TextInput::make('xp_reward')
                            ->label('XP reward')
                            ->numeric()
                            ->required()
                            ->default(0)
                            ->minValue(0),

                        TextInput::make('stars_reward')
                            ->label('Stars reward')
                            ->numeric()
                            ->required()
                            ->default(0)
                            ->minValue(0),

                        TextInput::make('estimated_minutes')
                            ->label('Estimated minutes')
                            ->numeric()
                            ->minValue(1)
                            ->nullable(),

                        Toggle::make('is_active')
                            ->label('Active')
                            ->default(true)
                            ->inline(false),
                    ])
                    ->columns(2),
            ]);
    }
}
