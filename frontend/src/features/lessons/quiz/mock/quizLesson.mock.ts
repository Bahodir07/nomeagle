import type { QuizLesson } from '../types';

export const quizLessonMock: QuizLesson = {
    lessonId: 'quiz-japan-etiquette-01',
    title: 'Japanese Etiquette & World Traditions',
    xpPerCorrect: 10,
    questions: [
        {
            id: 'q1',
            prompt: 'What is the proper way to hand a business card in Japan?',
            options: [
                { id: 'q1a', text: 'Toss it across the table casually' },
                { id: 'q1b', text: 'Present it with both hands and a slight bow' },
                { id: 'q1c', text: 'Slide it under the door before a meeting' },
                { id: 'q1d', text: 'Fold it in half so it fits in a pocket' },
            ],
            correctOptionId: 'q1b',
            explanation:
                'In Japan, business cards (meishi) are exchanged with both hands and a bow as a sign of respect.',
        },
        {
            id: 'q2',
            prompt: 'Which action is considered rude when eating in Japan?',
            options: [
                { id: 'q2a', text: 'Slurping noodles loudly' },
                { id: 'q2b', text: 'Saying "itadakimasu" before eating' },
                { id: 'q2c', text: 'Sticking chopsticks upright in rice' },
                { id: 'q2d', text: 'Holding the rice bowl while eating' },
            ],
            correctOptionId: 'q2c',
            explanation:
                'Sticking chopsticks upright in rice resembles a funeral ritual and is considered very disrespectful.',
        },
        {
            id: 'q3',
            prompt: 'What should you do before entering a traditional Japanese home?',
            options: [
                { id: 'q3a', text: 'Knock three times loudly' },
                { id: 'q3b', text: 'Remove your shoes at the entrance' },
                { id: 'q3c', text: 'Bring a bouquet of white flowers' },
                { id: 'q3d', text: 'Clap twice to announce your arrival' },
            ],
            correctOptionId: 'q3b',
            explanation:
                'Removing shoes before entering a home keeps the living space clean and is a deeply rooted custom.',
        },
        {
            id: 'q4',
            prompt: 'In Thailand, which part of the body is considered the most sacred?',
            options: [
                { id: 'q4a', text: 'The feet' },
                { id: 'q4b', text: 'The hands' },
                { id: 'q4c', text: 'The head' },
                { id: 'q4d', text: 'The heart' },
            ],
            correctOptionId: 'q4c',
            explanation:
                'In Thai culture the head is regarded as the highest and most sacred part of the body. Touching someone\'s head is considered offensive.',
        },
        {
            id: 'q5',
            prompt: 'How can you prepare for future careers that don\'t yet exist?',
            options: [
                { id: 'q5a', text: 'You should wait to choose a career until new ones appear' },
                { id: 'q5b', text: 'Stick to traditional careers only' },
                { id: 'q5c', text: 'Keep learning and developing your skills' },
                { id: 'q5d', text: 'Avoid technology-based jobs' },
            ],
            correctOptionId: 'q5c',
            explanation:
                'Continuous learning and skill development are the best preparation for careers that have not been invented yet.',
        },
        {
            id: 'q6',
            prompt: 'In South Korea, what should you do when receiving a drink from an elder?',
            options: [
                { id: 'q6a', text: 'Grab it quickly with one hand' },
                { id: 'q6b', text: 'Accept it with both hands and turn away slightly to drink' },
                { id: 'q6c', text: 'Refuse it three times before accepting' },
                { id: 'q6d', text: 'Pour it on the ground as a toast' },
            ],
            correctOptionId: 'q6b',
            explanation:
                'Accepting a drink with both hands and turning slightly away from the elder shows respect in Korean culture.',
        },
        {
            id: 'q7',
            prompt: 'What is "omotenashi" in Japanese culture?',
            options: [
                { id: 'q7a', text: 'A traditional martial art' },
                { id: 'q7b', text: 'A type of tea ceremony' },
                { id: 'q7c', text: 'The spirit of selfless hospitality' },
                { id: 'q7d', text: 'A greeting used at festivals' },
            ],
            correctOptionId: 'q7c',
            explanation:
                'Omotenashi refers to wholehearted, anticipatory hospitality where hosts care for guests without expecting anything in return.',
        },
    ],
};
