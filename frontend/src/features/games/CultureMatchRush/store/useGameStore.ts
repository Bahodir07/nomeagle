import { create } from 'zustand';
import { GameLevel, GameState, Tradition } from '../types';

interface ToastData {
  id: string;
  fact: string;
  deepDive: string;
}

export type CountdownPhase = 3 | 2 | 1 | 'go' | null;

interface GameStore {
  // Config
  level: GameLevel | null;

  // Setup phase — shown before countdown starts
  phase: 'setup' | 'playing';

  // State
  gameState: GameState;
  countdownPhase: CountdownPhase;
  timeLeft: number;
  score: number;
  comboCount: number;
  maxCombo: number;
  cards: Tradition[];
  currentCardIndex: number;
  correctCount: number;
  incorrectCount: number;
  xpGained: number;
  activeToast: ToastData | null;
  /** For correct: show green flash + floating points. For incorrect: show red + shake. */
  lastMatchResult: 'correct' | 'incorrect' | null;
  lastPointsEarned: number;
  /** Learn More modal — pauses game when open */
  learnMoreOpen: boolean;
  learnMoreData: ToastData | null;
  
  // Actions
  startSetup: () => void;
  initializeGame: (level: GameLevel) => void;
  startCountdown: () => void;
  tickCountdown: () => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  tickTimer: () => void;
  endGame: () => void;
  handleMatch: (isCorrect: boolean, timeSinceCardAppeared: number, card: Tradition) => void;
  clearToast: () => void;
  clearMatchFeedback: () => void;
  openLearnMore: (data: ToastData) => void;
  closeLearnMore: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  level: null,
  phase: 'setup',
  gameState: 'idle',
  countdownPhase: null,
  timeLeft: 0,
  score: 0,
  comboCount: 0,
  maxCombo: 0,
  cards: [],
  currentCardIndex: 0,
  correctCount: 0,
  incorrectCount: 0,
  xpGained: 0,
  activeToast: null,
  lastMatchResult: null,
  lastPointsEarned: 0,
  learnMoreOpen: false,
  learnMoreData: null,

  startSetup: () => set({ phase: 'setup' }),

  initializeGame: (level: GameLevel) => {
    const shuffledCards = [...level.traditions].sort(() => Math.random() - 0.5);
    set({
      level,
      phase: 'playing',
      gameState: 'idle',
      countdownPhase: null,
      timeLeft: level.timeLimitSeconds,
      score: 0,
      comboCount: 0,
      maxCombo: 0,
      cards: shuffledCards,
      currentCardIndex: 0,
      correctCount: 0,
      incorrectCount: 0,
      xpGained: 0,
      activeToast: null,
      lastMatchResult: null,
      lastPointsEarned: 0,
      learnMoreOpen: false,
      learnMoreData: null,
    });
  },

  startCountdown: () => set({ countdownPhase: 3 }),
  tickCountdown: () => {
    const { countdownPhase } = get();
    if (countdownPhase === 3) set({ countdownPhase: 2 });
    else if (countdownPhase === 2) set({ countdownPhase: 1 });
    else if (countdownPhase === 1) set({ countdownPhase: 'go' });
    else if (countdownPhase === 'go') {
      set({ countdownPhase: null });
      get().startGame();
    }
  },
  startGame: () => set({ gameState: 'playing' }),
  
  pauseGame: () => set({ gameState: 'paused' }),
  
  resumeGame: () => set({ gameState: 'playing' }),

  tickTimer: () => {
    const { timeLeft, gameState } = get();
    if (gameState !== 'playing') return;
    
    if (timeLeft <= 1) {
      get().endGame();
    } else {
      set({ timeLeft: timeLeft - 1 });
    }
  },

  endGame: () => {
    const { score, correctCount, incorrectCount } = get();
    let xpGained = 0;
    if (score >= 2000) xpGained = 50;
    else if (score >= 1000) xpGained = 25;
    else if (score > 0) xpGained = 10;
    // Perfect round: 0 mistakes and at least one correct
    if (incorrectCount === 0 && correctCount > 0) xpGained += 50;
    set({ gameState: 'ended', timeLeft: 0, xpGained });
  },

  handleMatch: (isCorrect: boolean, timeSinceCardAppeared: number, card: Tradition) => {
    const state = get();
    
    if (isCorrect) {
      // Calculate multiplier
      const newCombo = state.comboCount + 1;
      let multiplier = 1.0;
      if (newCombo >= 10) multiplier = 3.0;
      else if (newCombo >= 5) multiplier = 2.0;
      else if (newCombo >= 3) multiplier = 1.5;

      // Calculate score
      const baseScore = 100;
      const speedBonus = timeSinceCardAppeared <= 3 ? 50 : 0;
      const pointsEarned = Math.floor((baseScore + speedBonus) * multiplier);

      set({
        score: state.score + pointsEarned,
        comboCount: newCombo,
        maxCombo: Math.max(state.maxCombo, newCombo),
        correctCount: state.correctCount + 1,
        activeToast: { id: Date.now().toString(), fact: card.microFact, deepDive: card.deepDive },
        currentCardIndex: state.currentCardIndex + 1,
        lastMatchResult: 'correct',
        lastPointsEarned: pointsEarned,
      });
      
      // If we ran out of cards, end game
      if (state.currentCardIndex + 1 >= state.cards.length) {
         get().endGame();
      }
    } else {
      set({
        score: Math.max(0, state.score - 20),
        comboCount: 0,
        incorrectCount: state.incorrectCount + 1,
        lastMatchResult: 'incorrect',
        lastPointsEarned: 0,
      });
    }
  },

  clearToast: () => set({ activeToast: null }),
  clearMatchFeedback: () => set({ lastMatchResult: null, lastPointsEarned: 0 }),
  openLearnMore: (data: ToastData) => {
    set({ learnMoreOpen: true, learnMoreData: data });
    get().pauseGame();
  },
  closeLearnMore: () => set({ learnMoreOpen: false, learnMoreData: null }),
}));
