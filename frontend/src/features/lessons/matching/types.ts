export type MatchingSide = "left" | "right";

export type MatchingContentType = "text" | "image" | "text-image";

export interface MatchingItemContent {
    id: string;
    text: string;
    imageUrl?: string;
}

export interface MatchingItem extends MatchingItemContent {
    side: MatchingSide;
    pairId: string;
}

export interface MatchingPair {
    pairId: string;
    left: MatchingItemContent;
    right: MatchingItemContent;
}

export interface MatchingLesson {
    lessonId: string;
    title: string;
    instruction: string;
    pairs: MatchingPair[];
    contentType: MatchingContentType;
    xpReward: number;
}
