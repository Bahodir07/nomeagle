<?php

namespace App\Filament\Resources\VideoLessons\Pages;

use App\Filament\Resources\VideoLessons\VideoLessonResource;
use Filament\Resources\Pages\CreateRecord;

class CreateVideoLesson extends CreateRecord
{
    protected static string $resource = VideoLessonResource::class;
}
