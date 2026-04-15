import type { ScenarioLesson } from '../types';

export const japanEtiquetteScenarioMock: ScenarioLesson = {
    lessonId: 'scenario-japan-etiquette-01',
    title: 'Visiting Japan \u2014 Cultural Decisions',
    introText:
        'You are visiting Japan for the first time. ' +
        'You will face different cultural situations where your choices matter. ' +
        'Choose the most respectful action in each scenario.',
    xpReward: 50,
    steps: [
        {
            id: 's1',
            title: 'Entering a Japanese Home',
            description:
                'You arrive at your host family\'s home in Kyoto. The front door opens into a small entryway called a "genkan." Your host greets you with a warm smile. What do you do with your shoes?',
            choices: [
                {
                    id: 's1a',
                    text: 'Keep your shoes on and walk inside',
                    correct: false,
                    correctMessage: '',
                    wrongMessage:
                        'In Japan, wearing outdoor shoes inside a home is considered very disrespectful. The genkan exists specifically as a place to remove footwear before stepping up into the living area.',
                },
                {
                    id: 's1b',
                    text: 'Remove your shoes at the entrance',
                    correct: true,
                    correctMessage:
                        'Correct! Removing shoes at the genkan is one of the most important customs in Japan. It keeps the home clean and shows respect for your host\'s space.',
                    wrongMessage: '',
                },
                {
                    id: 's1c',
                    text: 'Ask your host if shoes are allowed inside',
                    correct: false,
                    correctMessage: '',
                    wrongMessage:
                        'While asking shows consideration, removing shoes before entering a Japanese home is a universal expectation. Your host might feel awkward having to explain such a basic custom.',
                },
            ],
        },
        {
            id: 's2',
            title: 'Receiving a Business Card',
            description:
                'At a welcome meeting, your host\'s colleague offers you their business card (meishi). They present it with both hands and a slight bow. How do you receive it?',
            choices: [
                {
                    id: 's2a',
                    text: 'Take it with one hand and slip it into your pocket',
                    correct: false,
                    correctMessage: '',
                    wrongMessage:
                        'Pocketing a business card immediately is seen as dismissive. In Japan, a meishi represents the person \u2014 treating it carelessly is like disrespecting them directly.',
                },
                {
                    id: 's2b',
                    text: 'Receive it with both hands and examine it respectfully',
                    correct: true,
                    correctMessage:
                        'Well done! Receiving a meishi with both hands, reading it carefully, and placing it respectfully on the table shows you value the person and their role.',
                    wrongMessage: '',
                },
                {
                    id: 's2c',
                    text: 'Smile and ignore it \u2014 you\'ll connect on social media later',
                    correct: false,
                    correctMessage: '',
                    wrongMessage:
                        'Ignoring a business card in Japan is a serious social misstep. The exchange of meishi is a formal ritual that establishes mutual respect and professional identity.',
                },
            ],
        },
        {
            id: 's3',
            title: 'Eating Sushi at a Restaurant',
            description:
                'Your host takes you to a traditional sushi restaurant. A plate of beautifully prepared nigiri is placed in front of you. How should you eat it?',
            choices: [
                {
                    id: 's3a',
                    text: 'Mix a large amount of wasabi into the soy sauce',
                    correct: false,
                    correctMessage: '',
                    wrongMessage:
                        'Mixing wasabi into soy sauce is considered poor etiquette at traditional sushi restaurants. The chef has already applied the right amount of wasabi between the fish and rice.',
                },
                {
                    id: 's3b',
                    text: 'Eat it with your hands or chopsticks \u2014 both are acceptable',
                    correct: true,
                    correctMessage:
                        'That\'s right! In Japan, eating nigiri sushi with your hands is perfectly acceptable and even traditional. Chopsticks work too \u2014 the chef won\'t mind either way.',
                    wrongMessage: '',
                },
                {
                    id: 's3c',
                    text: 'Ask the waiter for a fork and knife',
                    correct: false,
                    correctMessage: '',
                    wrongMessage:
                        'While the staff would accommodate you, asking for a fork at a traditional sushi restaurant may come across as culturally unaware. Hands or chopsticks are the way to go.',
                },
            ],
        },
        {
            id: 's4',
            title: 'Riding the Train',
            description:
                'You board a crowded commuter train in Tokyo during the morning rush. Your phone rings \u2014 it\'s a friend calling from home. What do you do?',
            choices: [
                {
                    id: 's4a',
                    text: 'Answer and have a normal conversation',
                    correct: false,
                    correctMessage: '',
                    wrongMessage:
                        'Talking on the phone on Japanese trains is considered very rude. Signs throughout the carriages ask passengers to switch phones to silent mode.',
                },
                {
                    id: 's4b',
                    text: 'Keep your phone on silent and speak quietly or text back',
                    correct: true,
                    correctMessage:
                        'Perfect! Japanese trains have a strong culture of quiet courtesy. Keeping your phone silent and texting rather than calling is the respectful choice.',
                    wrongMessage: '',
                },
                {
                    id: 's4c',
                    text: 'Watch videos on your phone with the speaker on',
                    correct: false,
                    correctMessage: '',
                    wrongMessage:
                        'Playing audio out loud on public transport in Japan is a major faux pas. Use earphones or wait until you\'re off the train.',
                },
            ],
        },
        {
            id: 's5',
            title: 'Receiving a Gift',
            description:
                'At the end of your visit, your host presents you with a beautifully wrapped gift. They hand it to you with both hands and a bow. What is the polite thing to do?',
            choices: [
                {
                    id: 's5a',
                    text: 'Tear it open right away to show excitement',
                    correct: false,
                    correctMessage: '',
                    wrongMessage:
                        'In Japan, opening a gift immediately in front of the giver can seem impatient or greedy. The wrapping itself is part of the gesture and deserves appreciation.',
                },
                {
                    id: 's5b',
                    text: 'Thank them graciously and wait to open it later',
                    correct: true,
                    correctMessage:
                        'Exactly! In Japanese culture, it\'s customary to accept a gift with gratitude and open it privately later. This avoids putting either party in an awkward situation.',
                    wrongMessage: '',
                },
                {
                    id: 's5c',
                    text: 'Politely refuse the gift',
                    correct: false,
                    correctMessage: '',
                    wrongMessage:
                        'While modesty is valued, outright refusing a gift can hurt your host\'s feelings. A gentle initial refusal followed by acceptance is common, but never a flat rejection.',
                },
            ],
        },
    ],
};
