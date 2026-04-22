<?php

namespace App\Filament\Resources\VideoLessons\Schemas;

use App\Enums\LessonType;
use App\Models\Lesson;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class VideoLessonForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Video lesson information')
                ->schema([
                    Hidden::make('type')
                        ->default(LessonType::VIDEO->value)
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

            Section::make('Video source')
                ->schema([
                    Select::make('video_source')
                        ->options([
                            'upload' => 'Upload file',
                            'external' => 'External URL',
                        ])
                        ->default('upload')
                        ->required()
                        ->native(false)
                        ->live(),

                    FileUpload::make('video_file')
                        ->label('Video file')
                        ->disk('public')
                        ->directory('lesson-videos')
                        ->visibility('public')
                        ->acceptedFileTypes([
                            'video/mp4',
                            'video/webm',
                            'video/quicktime',
                        ])
                        ->maxSize(51200)
                        ->downloadable()
                        ->openable()
                        ->previewable(false)
                        ->visible(fn ($get) => $get('video_source') === 'upload')
                        ->required(fn ($get) => $get('video_source') === 'upload'),

                    TextInput::make('external_video_url')
                        ->label('External video URL')
                        ->url()
                        ->visible(fn ($get) => $get('video_source') === 'external')
                        ->required(fn ($get) => $get('video_source') === 'external'),

                    TextInput::make('video_disk')
                        ->default('public')
                        ->readOnly()
                        ->dehydrated(true),

                    TextInput::make('content.duration_seconds')
                        ->label('Duration (seconds)')
                        ->numeric()
                        ->minValue(1)
                        ->nullable(),

                    Textarea::make('content.transcript')
                        ->label('Transcript')
                        ->rows(8)
                        ->columnSpanFull(),

                    Textarea::make('content.summary')
                        ->label('Short summary')
                        ->rows(4)
                        ->columnSpanFull(),

                    Textarea::make('content.key_takeaways')
                        ->label('Key takeaways')
                        ->rows(5)
                        ->columnSpanFull(),
                ])
                ->columns(2),
        ]);
    }
}
