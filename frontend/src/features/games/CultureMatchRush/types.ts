export interface Category {
  id: string;
  title: string;
  color: string;
  label: string;
}

export interface Tradition {
  id: string;
  text: string;
  emoji: string;
  categoryId: string;
  microFact: string;
  deepDive: string;
}

export interface GameLevel {
  countryId: string;
  countryName: string;
  timeLimitSeconds: number;
  backgroundImage?: string;
  categories: Category[];
  traditions: Tradition[];
}

export type GameState = 'idle' | 'playing' | 'paused' | 'ended';

export interface GameStats {
  score: number;
  correctCount: number;
  incorrectCount: number;
  maxCombo: number;
  xpGained: number;
}
