import React from 'react';
import { useFestivalStore } from './store/useFestivalStore';
import { SetupMenu } from './components/SetupMenu';
import { GameBoard } from './components/GameBoard';
import { ResultScreen } from './components/ResultScreen';
import styles from './FestivalTimeline.module.css';

export const FestivalTimeline: React.FC = () => {
    const gameState = useFestivalStore(s => s.gameState);

    return (
        <div className={styles.container}>
            {gameState === 'setup' && <SetupMenu />}
            {gameState === 'playing' && <GameBoard />}
            {gameState === 'ended' && <ResultScreen />}
        </div>
    );
};
