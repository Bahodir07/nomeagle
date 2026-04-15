import { ArticleLesson } from '../types';

export const mockArticleLesson: ArticleLesson = {
    lessonId: 'lesson-etiquette-bowing',
    title: 'Etiquette | Bowing',
    pages: [
        {
            id: 'page-1',
            imageUrl: '/assets/lessons/bowing-1.png',
            paragraphs: [
                'Bowing is a traditional greeting in many cultures around the world. It is a sign of respect, politeness, and acknowledgement.',
                'When you bow, you show that you value the other person and recognize their presence respectfully.',
            ]
        },
        {
            id: 'page-2',
            paragraphs: [
                'A slight nod of the head is often used for informal greetings between friends and colleagues.',
                'A deeper bow from the waist is typically reserved for formal occasions or when greeting someone of higher status.'
            ]
        }
    ]
};
