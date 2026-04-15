import { FlashcardsLesson } from '../types';

export const mockFlashcardsLesson: FlashcardsLesson = {
    lessonId: 'lesson-jp-etiquette-flashcards',
    title: 'Japan | Etiquette Basics',
    xpPerCard: 10,
    masteryTargetPct: 80,
    cards: [
        {
            id: 'fc-bow-greeting',
            front: {
                title: 'Bowing as a Greeting',
                subtitle: 'How do the Japanese greet each other?',
            },
            back: {
                explanation:
                    'A bow (ojigi) replaces a handshake. The deeper the bow, the more respect it conveys.',
                examples: [
                    '15-degree bow for casual greetings',
                    '30-degree bow for business settings',
                    '45-degree bow for deep apologies or high-status individuals',
                ],
            },
            tags: ['bowing', 'greetings'],
        },
        {
            id: 'fc-bow-duration',
            front: {
                title: 'Bow Duration',
                subtitle: 'How long should you hold a bow?',
            },
            back: {
                explanation:
                    'Match the duration of the person you are greeting. A casual bow lasts about one second; a formal bow is held for two to three seconds.',
            },
            tags: ['bowing'],
        },
        {
            id: 'fc-chopsticks-standing',
            front: {
                title: 'Chopsticks in Rice',
                subtitle: 'Why should you never stick chopsticks upright in rice?',
            },
            back: {
                explanation:
                    'Standing chopsticks in rice resembles incense at a funeral. It is considered very disrespectful.',
                examples: [
                    'Rest chopsticks on the hashioki (chopstick rest) instead',
                    'Lay them across the rim of a plate when no rest is available',
                ],
            },
            imageUrl: '/assets/lessons/chopsticks-rice.png',
            tags: ['chopsticks', 'dining'],
        },
        {
            id: 'fc-chopsticks-passing',
            front: {
                title: 'Passing Food with Chopsticks',
                subtitle: 'Can you pass food from chopstick to chopstick?',
            },
            back: {
                explanation:
                    'Never pass food directly between chopsticks. This mirrors a funeral ritual where bones are passed. Place the food on a shared plate instead.',
            },
            tags: ['chopsticks', 'dining'],
        },
        {
            id: 'fc-chopsticks-pointing',
            front: {
                title: 'Pointing with Chopsticks',
            },
            back: {
                explanation:
                    'Pointing at people or objects with chopsticks is considered rude. Keep them aimed at your food or resting on the holder.',
            },
            tags: ['chopsticks', 'dining'],
        },
        {
            id: 'fc-gift-wrapping',
            front: {
                title: 'Gift Wrapping',
                subtitle: 'Does presentation matter when giving a gift?',
            },
            back: {
                explanation:
                    'Presentation matters as much as the gift itself. Neatly wrapped gifts show care and respect. Avoid wrapping in white or black, which are funeral colors.',
                examples: [
                    'Use pastel or bright-colored wrapping',
                    'Department-store wrapping is always safe',
                ],
            },
            tags: ['gifts'],
        },
        {
            id: 'fc-gift-receiving',
            front: {
                title: 'Receiving a Gift',
                subtitle: 'Should you open a gift right away?',
            },
            back: {
                explanation:
                    'In Japan it is polite to wait and open a gift later in private, unless the giver insists. Always receive the gift with both hands.',
            },
            tags: ['gifts'],
        },
        {
            id: 'fc-gift-numbers',
            front: {
                title: 'Gift Quantities',
                subtitle: 'Are certain numbers unlucky for gifts?',
            },
            back: {
                explanation:
                    'Avoid giving items in sets of four (shi sounds like death) or nine (ku sounds like suffering). Odd numbers other than these are generally preferred.',
            },
            tags: ['gifts'],
        },
        {
            id: 'fc-train-silence',
            front: {
                title: 'Silence on Trains',
                subtitle: 'Can you talk on the phone during a train ride?',
            },
            back: {
                explanation:
                    'Phone calls on trains are strongly discouraged. Set your phone to manner mode (silent) and avoid loud conversations out of respect for other passengers.',
                examples: [
                    'Text or message instead of calling',
                    'Step off at the next station if a call is urgent',
                ],
            },
            tags: ['train', 'public transport'],
        },
        {
            id: 'fc-train-priority',
            front: {
                title: 'Priority Seating',
                subtitle: 'Who gets priority seats on Japanese trains?',
            },
            back: {
                explanation:
                    'Priority seats are for the elderly, pregnant women, people with disabilities, and those with small children. Even if the car is empty, many locals avoid sitting there.',
            },
            tags: ['train', 'public transport'],
        },
        {
            id: 'fc-train-queuing',
            front: {
                title: 'Queuing at the Platform',
            },
            back: {
                explanation:
                    'Passengers line up along marked spots on the platform and let everyone exit before boarding. Cutting the queue is a serious social faux pas.',
            },
            tags: ['train', 'public transport'],
        },
        {
            id: 'fc-shoes-indoor',
            front: {
                title: 'Shoes Indoors',
                subtitle: 'When should you remove your shoes?',
            },
            back: {
                explanation:
                    'Remove shoes before entering homes, temples, some restaurants, and traditional ryokan inns. Look for a genkan (entryway step). Slippers are often provided.',
                examples: [
                    'Point your shoes toward the door when you remove them',
                    'Switch to toilet slippers in the bathroom',
                ],
            },
            tags: ['shoes', 'indoor etiquette'],
        },
    ],
};
