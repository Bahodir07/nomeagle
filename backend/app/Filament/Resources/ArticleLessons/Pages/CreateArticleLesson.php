<?php

namespace App\Filament\Resources\ArticleLessons\Pages;

use App\Filament\Resources\ArticleLessons\ArticleLessonResource;
use Filament\Resources\Pages\CreateRecord;

class CreateArticleLesson extends CreateRecord
{
    protected static string $resource = ArticleLessonResource::class;
}
