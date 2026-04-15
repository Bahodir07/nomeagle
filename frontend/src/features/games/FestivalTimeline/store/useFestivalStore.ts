import { create } from 'zustand';
import {
    DifficultyLevel,
    FestivalData,
    GameState,
    ScoreDetails,
    TimelineMode
} from '../types';
import { getCountryInfo, getFestivalsForCountry } from '../data/festivals';

interface PlacedCard {
    slotId: string;
    festivalId: string;
}

interface FestivalStore {
    mode: TimelineMode;
    difficulty: DifficultyLevel;
    targetCountryId: string;
    targetCountryName: string;
    targetCountryFlag: string;

    gameState: GameState;
    timeLeft: number;
    duration: number;

    festivals: FestivalData[];      // Total pool for this round
    unplacedCards: FestivalData[];  // Cards still in the tray
    placedCards: PlacedCard[];      // Cards successfully placed (locked in)

    scoreDetails: ScoreDetails;
    currentStreak: number;
    mistakesMade: number;

    lastMicroLesson: FestivalData | null;
    showLessonUntil: number; // timestamp

    // Actions
    configure: (mode: TimelineMode, difficulty: DifficultyLevel, targetCountryId: string) => void;
    startPlaying: () => void;
    tick: () => void;
    handleDrop: (festivalId: string, slotId: string) => boolean; // returns true if correct
    endGame: () => void;
    reset: () => void;
    clearLesson: () => void;
}

const BASE_SCORE = 100;
const STREAK_BONUS = 20;

export const useFestivalStore = create<FestivalStore>((set, get) => ({
    mode: 'season',
    difficulty: 1,
    targetCountryId: 'IN',
    targetCountryName: 'India',
    targetCountryFlag: '🇮🇳',

    gameState: 'setup',
    timeLeft: 60,
    duration: 60,

    festivals: [],
    unplacedCards: [],
    placedCards: [],

    scoreDetails: {
        base: 0,
        timeBonus: 0,
        streakBonus: 0,
        perfectBonus: 0,
        total: 0,
    },
    currentStreak: 0,
    mistakesMade: 0,

    lastMicroLesson: null,
    showLessonUntil: 0,

    configure: (mode, difficulty, targetCountryId) => {
        const country = getCountryInfo(targetCountryId);
        if (!country) return;

        let festivals = getFestivalsForCountry(targetCountryId);

        // Simple filter for the mock - shuffle and slice
        festivals = festivals.sort(() => Math.random() - 0.5).slice(0, 4);

        const duration = difficulty === 1 ? 60 : difficulty === 2 ? 45 : 30;

        set({
            mode,
            difficulty,
            targetCountryId: country.id,
            targetCountryName: country.name,
            targetCountryFlag: country.flag,
            gameState: 'setup',
            duration,
            timeLeft: duration,
            festivals,
            unplacedCards: festivals,
            placedCards: [],
            scoreDetails: { base: 0, timeBonus: 0, streakBonus: 0, perfectBonus: 0, total: 0 },
            currentStreak: 0,
            mistakesMade: 0,
            lastMicroLesson: null,
            showLessonUntil: 0,
        });
    },

    startPlaying: () => set({ gameState: 'playing' }),

    tick: () => {
        const state = get();
        if (state.gameState !== 'playing') return;

        const newTime = state.timeLeft - 1;
        if (newTime <= 0) {
            get().endGame();
        } else {
            set({ timeLeft: newTime });
        }
    },

    handleDrop: (festivalId, slotId) => {
        const state = get();
        if (state.gameState !== 'playing') return false;

        const festival = state.unplacedCards.find(f => f.id === festivalId);
        if (!festival) return false;

        // Validation logic (assuming slots are season strings for mode A)
        let isCorrect = false;
        if (state.mode === 'season') {
            isCorrect = festival.season === slotId;
        } else if (state.mode === 'calendar') {
            isCorrect = festival.month.toString() === slotId;
        }

        if (isCorrect) {
            // Calculate Score
            const baseEarned = BASE_SCORE;
            const streakEarned = state.currentStreak * STREAK_BONUS;

            const newScore = {
                ...state.scoreDetails,
                base: state.scoreDetails.base + baseEarned,
                streakBonus: state.scoreDetails.streakBonus + streakEarned,
            };
            newScore.total = newScore.base + newScore.timeBonus + newScore.streakBonus + newScore.perfectBonus;

            const newUnplaced = state.unplacedCards.filter(f => f.id !== festivalId);

            set({
                unplacedCards: newUnplaced,
                placedCards: [...state.placedCards, { slotId, festivalId }],
                scoreDetails: newScore,
                currentStreak: state.currentStreak + 1,
                lastMicroLesson: festival,
                showLessonUntil: Date.now() + 4000,
            });

            // Check if round won
            if (newUnplaced.length === 0) {
                setTimeout(() => get().endGame(), 500); // Small delay to let animations finish
            }

            return true;
        } else {
            set({
                currentStreak: 0,
                mistakesMade: state.mistakesMade + 1,
                timeLeft: Math.max(0, state.timeLeft - 5) // Penalize time
            });
            return false;
        }
    },

    endGame: () => {
        const state = get();
        if (state.gameState === 'ended') return;

        let timeBonus = 0;
        let perfectBonus = 0;

        if (state.unplacedCards.length === 0) {
            timeBonus = state.timeLeft * 5;
            if (state.mistakesMade === 0) {
                perfectBonus = 250;
            }
        }

        const finalScore = {
            ...state.scoreDetails,
            timeBonus,
            perfectBonus,
        };
        finalScore.total = finalScore.base + finalScore.streakBonus + timeBonus + perfectBonus;

        set({
            gameState: 'ended',
            scoreDetails: finalScore,
            timeLeft: 0,
        });
    },

    clearLesson: () => set({ lastMicroLesson: null }),

    reset: () => {
        const state = get();
        get().configure(state.mode, state.difficulty, state.targetCountryId);
    }
}));
