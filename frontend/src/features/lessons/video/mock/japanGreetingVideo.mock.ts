import type { VideoLesson } from '../types';

export const mockJapanGreetingVideo: VideoLesson = {
    lessonId: 'lesson-japan-greetings-video',
    title: 'Greetings in Japan',
    description:
        'A short introduction to respectful greeting customs in Japan, including bowing, formality, and body language.',
    videoUrl: '/videos/japan-greetings.mp4',
    thumbnailUrl: '/assets/images/japan-greetings-thumb.jpg',
    durationSeconds: 150,
    completionThresholdPct: 90,
    xpReward: 30,
    transcript: [
        {
            id: 'tb-1',
            text: 'In Japan, greetings are much more than a casual hello. They reflect deep cultural values of respect, humility, and awareness of social hierarchy.',
            startSeconds: 0,
            endSeconds: 12,
        },
        {
            id: 'tb-2',
            text: 'The bow, known as ojigi, is the most common form of greeting. The depth and duration of a bow communicate different levels of politeness and formality.',
            startSeconds: 12,
            endSeconds: 28,
        },
        {
            id: 'tb-3',
            text: 'A slight nod of about fifteen degrees, called eshaku, is used for casual greetings between friends or colleagues of equal standing.',
            startSeconds: 28,
            endSeconds: 42,
        },
        {
            id: 'tb-4',
            text: 'A deeper bow of around thirty degrees, known as keirei, is the standard respectful bow used in most business and formal situations.',
            startSeconds: 42,
            endSeconds: 58,
        },
        {
            id: 'tb-5',
            text: 'The deepest bow, saikeirei, bends at roughly forty-five degrees or more. It is reserved for expressing sincere apology, deep gratitude, or greeting someone of very high status.',
            startSeconds: 58,
            endSeconds: 76,
        },
        {
            id: 'tb-6',
            text: 'Body posture matters just as much as the bow itself. Keep your back straight, arms at your sides, and eyes directed downward as you bend forward.',
            startSeconds: 76,
            endSeconds: 92,
        },
        {
            id: 'tb-7',
            text: 'Avoid making prolonged eye contact during a bow — in Japanese culture, looking away shows humility rather than disinterest.',
            startSeconds: 92,
            endSeconds: 106,
        },
        {
            id: 'tb-8',
            text: 'Handshakes are becoming more common in international business settings. If a Japanese person extends their hand, it is perfectly acceptable to shake it, but let them initiate.',
            startSeconds: 106,
            endSeconds: 124,
        },
        {
            id: 'tb-9',
            text: 'When greeting a group, acknowledge the most senior person first. This small gesture demonstrates your understanding of Japanese social hierarchy.',
            startSeconds: 124,
            endSeconds: 140,
        },
        {
            id: 'tb-10',
            text: 'Remember, a respectful greeting sets the tone for every interaction that follows. Mastering the bow is one of the first steps to understanding Japanese culture.',
            startSeconds: 140,
            endSeconds: 150,
        },
    ],
};
