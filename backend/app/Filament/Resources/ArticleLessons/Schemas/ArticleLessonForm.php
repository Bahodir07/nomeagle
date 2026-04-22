<?php

namespace App\Filament\Resources\ArticleLessons\Schemas;

use App\Enums\LessonType;
use App\Models\Lesson;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ArticleLessonForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Article lesson information')
                ->description('Basic metadata for the article lesson.')
                ->schema([
                    Hidden::make('type')
                        ->default(LessonType::ARTICLE->value)
                        ->dehydrated(true),

                    Select::make('module_id')
                        ->relationship('module', 'title')
                        ->searchable()
                        ->preload()
                        ->required(),

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
                        ->maxLength(255),

                    Textarea::make('description')
                        ->rows(3)
                        ->columnSpanFull(),

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

            Section::make('Article content')
                ->description('Structured content stored inside lessons.content JSON.')
                ->schema([
                    TextInput::make('content.hero_image_url')
                        ->label('Hero image URL')
                        ->url()
                        ->nullable()
                        ->columnSpanFull(),

                    TextInput::make('content.source_title')
                        ->label('Source title')
                        ->maxLength(255),

                    TextInput::make('content.source_url')
                        ->label('Source URL')
                        ->url()
                        ->nullable(),

                    Textarea::make('content.body')
                        ->label('Article body')
                        ->required()
                        ->rows(18)
                        ->columnSpanFull(),

                    Textarea::make('content.key_points')
                        ->label('Key points')
                        ->rows(6)
                        ->helperText('One point per line.')
                        ->columnSpanFull(),

                    Textarea::make('content.reflection_question')
                        ->label('Reflection question')
                        ->rows(3)
                        ->columnSpanFull(),
                ])
                ->columns(2),
        ]);
    }
}
