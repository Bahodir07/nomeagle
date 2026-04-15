export interface ArticleLessonPage {
    id: string;
    imageUrl?: string;
    paragraphs: string[];
}

export interface ArticleLesson {
    lessonId: string;
    title: string;
    pages: ArticleLessonPage[];
}
