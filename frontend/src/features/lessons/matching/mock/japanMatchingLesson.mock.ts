import type { MatchingLesson } from '../types';

export const mockJapanMatchingLesson: MatchingLesson = {
    lessonId: 'lesson-jp-etiquette-matching',
    title: 'Match the Japanese etiquette rule',
    instruction: 'Match each cultural action with its meaning.',
    contentType: 'text',
    xpReward: 60,
    pairs: [
        {
            pairId: 'pair-shoes',
            left: {
                id: 'left-shoes',
                text: 'Remove shoes at the entrance',
            },
            right: {
                id: 'right-shoes',
                text: 'Respect the cleanliness of the home',
            },
        },
        {
            pairId: 'pair-bow',
            left: {
                id: 'left-bow',
                text: 'Bow slightly when greeting',
            },
            right: {
                id: 'right-bow',
                text: 'Show respect politely',
            },
        },
        {
            pairId: 'pair-gift-receive',
            left: {
                id: 'left-gift-receive',
                text: 'Receive a gift with both hands',
            },
            right: {
                id: 'right-gift-receive',
                text: 'Show appreciation and courtesy',
            },
        },
        {
            pairId: 'pair-train',
            left: {
                id: 'left-train',
                text: 'Speak quietly on the train',
            },
            right: {
                id: 'right-train',
                text: 'Respect shared public space',
            },
        },
        {
            pairId: 'pair-chopsticks',
            left: {
                id: 'left-chopsticks',
                text: 'Do not stick chopsticks upright in rice',
            },
            right: {
                id: 'right-chopsticks',
                text: 'Avoid funeral-related symbolism',
            },
        },
        {
            pairId: 'pair-gift-open',
            left: {
                id: 'left-gift-open',
                text: 'Wait before opening a gift',
            },
            right: {
                id: 'right-gift-open',
                text: 'Follow modest and respectful etiquette',
            },
        },
    ],
};
