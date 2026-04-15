import { create } from 'zustand';
import {
  ActiveFood,
  CountdownPhase,
  DifficultyLevel,
  GameMode,
  SprintGameState,
  CountryInfo,
  TappedFood,
} from '../types';
import { COUNTRIES, getCountryInfo, shuffleCountries } from '../data/foods';

const DIFFICULTY_MULTIPLIER: Record<DifficultyLevel, number> = { 1: 1.0, 2: 1.5, 3: 2.0 };
const BASE_DURATION: Record<DifficultyLevel, number> = { 1: 10.0, 2: 7.5, 3: 5.0 };
const SPAWN_INTERVAL: Record<DifficultyLevel, number> = { 1: 2000, 2: 1500, 3: 1000 };
const FEVER_DURATION = 5;
const FEVER_TRIGGER = 10;
const COUNTRY_CHANGE_INTERVAL = 15;

interface SprintStore {
  mode: GameMode;
  difficulty: DifficultyLevel;
  targetCountryId: string;
  targetCountryName: string;
  targetCountryFlag: string;
  duration: number;

  gameState: SprintGameState;
  countdownPhase: CountdownPhase;
  timeLeft: number;
  elapsedTime: number;
  score: number;
  combo: number;
  maxCombo: number;
  consecutiveCorrect: number;
  isFeverTime: boolean;
  feverTimeLeft: number;
  activeFoods: ActiveFood[];

  correctCount: number;
  incorrectCount: number;
  missedCount: number;
  tappedFoods: TappedFood[];
  comboXPEarned: number;

  xpGained: number;

  countryQueue: CountryInfo[];
  countryQueueIndex: number;
  countryChangeTimer: number;

  configure: (mode: GameMode, difficulty: DifficultyLevel, targetCountryId: string) => void;
  startCountdown: () => void;
  tickCountdown: () => void;
  startPlaying: () => void;
  tick: () => void;
  addFood: (food: ActiveFood) => void;
  tapFood: (uid: string) => void;
  handleMiss: () => void;
  removeFood: (uid: string) => void;
  endGame: () => void;
  startTransition: () => void;
  endTransition: () => void;
  reset: () => void;
}

export function getSlideDuration(difficulty: DifficultyLevel, elapsedTime: number, isFever: boolean): number {
  const base = BASE_DURATION[difficulty];
  const speedScale = 1 - 0.05 * Math.floor(elapsedTime / 10);
  const clamped = Math.max(0.5, speedScale);
  const feverScale = isFever ? 0.7 : 1.0;
  return base * clamped * feverScale;
}

export function getSpawnInterval(difficulty: DifficultyLevel): number {
  return SPAWN_INTERVAL[difficulty];
}

export const useSprintStore = create<SprintStore>((set, get) => ({
  mode: 'focus',
  difficulty: 1,
  targetCountryId: 'JP',
  targetCountryName: 'Japan',
  targetCountryFlag: '🇯🇵',
  duration: 60,

  gameState: 'setup',
  countdownPhase: null,
  timeLeft: 60,
  elapsedTime: 0,
  score: 0,
  combo: 0,
  maxCombo: 0,
  consecutiveCorrect: 0,
  isFeverTime: false,
  feverTimeLeft: 0,
  activeFoods: [],

  correctCount: 0,
  incorrectCount: 0,
  missedCount: 0,
  tappedFoods: [],
  comboXPEarned: 0,

  xpGained: 0,

  countryQueue: [],
  countryQueueIndex: 0,
  countryChangeTimer: COUNTRY_CHANGE_INTERVAL,

  configure: (mode, difficulty, targetCountryId) => {
    const country = getCountryInfo(targetCountryId) ?? COUNTRIES[0];
    const duration = 60;
    const queue = mode === 'mixed' ? shuffleCountries(targetCountryId) : [];
    set({
      mode,
      difficulty,
      targetCountryId: country.id,
      targetCountryName: country.name,
      targetCountryFlag: country.flag,
      duration,
      timeLeft: duration,
      elapsedTime: 0,
      score: 0,
      combo: 0,
      maxCombo: 0,
      consecutiveCorrect: 0,
      isFeverTime: false,
      feverTimeLeft: 0,
      activeFoods: [],
      correctCount: 0,
      incorrectCount: 0,
      missedCount: 0,
      tappedFoods: [],
      comboXPEarned: 0,
      xpGained: 0,
      countryQueue: queue,
      countryQueueIndex: 0,
      countryChangeTimer: COUNTRY_CHANGE_INTERVAL,
      gameState: 'setup',
      countdownPhase: null,
    });
  },

  startCountdown: () => set({ gameState: 'countdown', countdownPhase: 3 }),

  tickCountdown: () => {
    const { countdownPhase } = get();
    if (countdownPhase === 3) set({ countdownPhase: 2 });
    else if (countdownPhase === 2) set({ countdownPhase: 1 });
    else if (countdownPhase === 1) set({ countdownPhase: 'go' });
    else if (countdownPhase === 'go') {
      set({ countdownPhase: null });
      get().startPlaying();
    }
  },

  startPlaying: () => set({ gameState: 'playing' }),

  tick: () => {
    const state = get();
    if (state.gameState !== 'playing') return;

    const newTimeLeft = state.timeLeft - 1;
    const newElapsed = state.elapsedTime + 1;

    if (newTimeLeft <= 0) {
      get().endGame();
      return;
    }

    let feverUpdate: Partial<SprintStore> = {};
    if (state.isFeverTime) {
      const newFeverLeft = state.feverTimeLeft - 1;
      if (newFeverLeft <= 0) {
        feverUpdate = { isFeverTime: false, feverTimeLeft: 0 };
      } else {
        feverUpdate = { feverTimeLeft: newFeverLeft };
      }
    }

    if (state.mode === 'mixed') {
      const newChangeTimer = state.countryChangeTimer - 1;
      if (newChangeTimer <= 0) {
        set({ timeLeft: newTimeLeft, elapsedTime: newElapsed, ...feverUpdate });
        get().startTransition();
        return;
      }
      set({ timeLeft: newTimeLeft, elapsedTime: newElapsed, countryChangeTimer: newChangeTimer, ...feverUpdate });
    } else {
      set({ timeLeft: newTimeLeft, elapsedTime: newElapsed, ...feverUpdate });
    }
  },

  addFood: (food) => {
    set(s => ({ activeFoods: [...s.activeFoods, food] }));
  },

  tapFood: (uid) => {
    const state = get();
    const foodItem = state.activeFoods.find(f => f.uid === uid);
    if (!foodItem || foodItem.tapped) return;

    const isCorrect = foodItem.food.countryId === state.targetCountryId;

    if (isCorrect) {
      const newCombo = state.combo + 1;
      const newConsecutive = state.consecutiveCorrect + 1;
      const comboMultiplier = Math.min(newCombo, 4);
      const diffMult = DIFFICULTY_MULTIPLIER[state.difficulty];
      const feverMult = state.isFeverTime ? 2 : 1;
      const points = Math.floor(10 * comboMultiplier * diffMult * feverMult);

      let comboBonus = 0;
      if (newCombo > 0 && newCombo % 5 === 0) comboBonus = 5;

      const triggerFever = newConsecutive >= FEVER_TRIGGER && !state.isFeverTime;

      set({
        activeFoods: state.activeFoods.map(f =>
          f.uid === uid ? { ...f, tapped: 'correct', pointsEarned: points, comboAtTap: newCombo } : f
        ),
        score: state.score + points,
        combo: newCombo,
        maxCombo: Math.max(state.maxCombo, newCombo),
        consecutiveCorrect: triggerFever ? 0 : newConsecutive,
        correctCount: state.correctCount + 1,
        comboXPEarned: state.comboXPEarned + comboBonus,
        tappedFoods: [...state.tappedFoods, { food: foodItem.food, wasCorrect: true }],
        ...(triggerFever ? { isFeverTime: true, feverTimeLeft: FEVER_DURATION } : {}),
      });

      setTimeout(() => get().removeFood(uid), 600);
    } else {
      set({
        activeFoods: state.activeFoods.map(f =>
          f.uid === uid ? { ...f, tapped: 'incorrect' } : f
        ),
        score: Math.max(0, state.score - 20),
        combo: 0,
        consecutiveCorrect: 0,
        incorrectCount: state.incorrectCount + 1,
        tappedFoods: [...state.tappedFoods, { food: foodItem.food, wasCorrect: false }],
      });

      setTimeout(() => get().removeFood(uid), 400);
    }
  },

  handleMiss: () => {
    set(s => ({
      missedCount: s.missedCount + 1,
      combo: 0,
      consecutiveCorrect: 0,
    }));
  },

  removeFood: (uid) => {
    set(s => ({
      activeFoods: s.activeFoods.filter(f => f.uid !== uid),
    }));
  },

  endGame: () => {
    const state = get();
    const { correctCount, incorrectCount, comboXPEarned, difficulty, mode } = state;
    const totalTaps = correctCount + incorrectCount;
    const accuracy = totalTaps > 0 ? (correctCount / totalTaps) * 100 : 0;

    let xp = correctCount;
    xp += comboXPEarned;

    if (accuracy === 100 && correctCount > 0) xp += 50;
    else if (accuracy > 90) xp += 25;

    if (incorrectCount === 0 && correctCount > 0) xp += 100;

    xp = Math.floor(xp * DIFFICULTY_MULTIPLIER[difficulty]);
    if (mode === 'mixed') xp = Math.floor(xp * 1.5);

    set({ gameState: 'ended', timeLeft: 0, xpGained: xp });
  },

  startTransition: () => {
    const state = get();
    const nextIndex = (state.countryQueueIndex + 1) % state.countryQueue.length;
    const nextCountry = state.countryQueue[nextIndex];

    set({
      gameState: 'transition',
      activeFoods: [],
      ...(nextCountry ? {
        targetCountryId: nextCountry.id,
        targetCountryName: nextCountry.name,
        targetCountryFlag: nextCountry.flag,
        countryQueueIndex: nextIndex,
      } : {}),
    });

    setTimeout(() => get().endTransition(), 1000);
  },

  endTransition: () => {
    set({
      gameState: 'playing',
      countryChangeTimer: COUNTRY_CHANGE_INTERVAL,
    });
  },

  reset: () => {
    set({
      gameState: 'setup',
      countdownPhase: null,
      timeLeft: 60,
      elapsedTime: 0,
      score: 0,
      combo: 0,
      maxCombo: 0,
      consecutiveCorrect: 0,
      isFeverTime: false,
      feverTimeLeft: 0,
      activeFoods: [],
      correctCount: 0,
      incorrectCount: 0,
      missedCount: 0,
      tappedFoods: [],
      comboXPEarned: 0,
      xpGained: 0,
      countryQueue: [],
      countryQueueIndex: 0,
      countryChangeTimer: COUNTRY_CHANGE_INTERVAL,
    });
  },
}));
