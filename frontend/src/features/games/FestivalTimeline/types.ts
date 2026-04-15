export interface FestivalData {
    id: string;
    name: string;
    countryId: string;
    season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
    month: number; // 1-12
    shortFact: string;
    image: string; // Using emoji for MVP
    difficultyLevel: 1 | 2 | 3;
}

export interface CountryInfo {
    id: string;
    name: string;
    flag: string;
}

export type TimelineMode = 'season' | 'calendar' | 'chronological';
export type DifficultyLevel = 1 | 2 | 3;
export type GameState = 'setup' | 'playing' | 'ended';

export interface DroppedCard {
    slotId: string;
    festivalId: string;
    isCorrect: boolean;
}

export interface ScoreDetails {
    base: number;
    timeBonus: number;
    streakBonus: number;
    perfectBonus: number;
    total: number;
}
