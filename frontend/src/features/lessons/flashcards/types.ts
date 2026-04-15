export interface Flashcard {
    id: string;
    front: {
        title: string;
        subtitle?: string;
    };
    back: {
        explanation: string;
        examples?: string[];
    };
    imageUrl?: string;
    tags?: string[];
}

export interface FlashcardsLesson {
    lessonId: string;
    title: string;
    cards: Flashcard[];
    xpPerCard: number;
    masteryTargetPct: number;
}
