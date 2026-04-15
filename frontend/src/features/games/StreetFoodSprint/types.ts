export interface FoodData {
  id: string;
  name: string;
  emoji: string;
  countryId: string;
  region: string;
  difficultyLevel: 1 | 2 | 3;
  microFact: string;
  deepDive: string;
}

export interface CountryInfo {
  id: string;
  name: string;
  flag: string;
}

export type GameMode = 'focus' | 'mixed';
export type DifficultyLevel = 1 | 2 | 3;
export type SprintGameState = 'setup' | 'countdown' | 'playing' | 'transition' | 'ended';
export type CountdownPhase = 3 | 2 | 1 | 'go' | null;

export interface ActiveFood {
  uid: string;
  food: FoodData;
  spawnedAt: number;
  lane: number;
  tapped?: 'correct' | 'incorrect';
  pointsEarned?: number;
  comboAtTap?: number;
  slideDuration: number;
}

export interface TappedFood {
  food: FoodData;
  wasCorrect: boolean;
}
