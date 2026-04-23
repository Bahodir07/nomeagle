import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import styles from './GamesPage.module.css';

/* ==========================================================================
   GamesPage — hub listing the four mini-game types
   ========================================================================== */

interface GameInfo {
  icon: string;
  title: string;
  description: string;
  countryCode: string;
  path: string;
}

const GAMES: GameInfo[] = [
  {
    icon: '🃏',
    title: 'Culture Match Rush',
    description: 'Drag and drop cultural traditions to the correct categories before time runs out.',
    countryCode: 'kz',
    path: '/app/countries/kz/game',
  },
  {
    icon: '🎉',
    title: 'Festival Timeline',
    description: 'Put famous festivals in the right chronological order and test your cultural knowledge.',
    countryCode: 'kz',
    path: '/app/countries/kz/festival',
  },
  {
    icon: '🏛️',
    title: 'Guess the Landmark',
    description: 'Identify iconic landmarks from around the world as fast as you can.',
    countryCode: 'kz',
    path: '/app/countries/kz/landmarks',
  },
  {
    icon: '🍜',
    title: 'Street Food Sprint',
    description: 'Catch the right dishes flying down the conveyor — a fast-paced food culture challenge.',
    countryCode: 'kz',
    path: '/app/countries/kz/sprint',
  },
];

export const GamesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Mini-Games</h1>
        <p className={styles.subtitle}>
          Challenge yourself with culture-based games and earn XP.
        </p>
      </header>

      <div className={styles.grid}>
        {GAMES.map((game) => (
          <Card key={game.path} className={styles.card}>
            <CardContent className={styles.cardContent}>
              <span className={styles.icon} aria-hidden="true">{game.icon}</span>
              <h2 className={styles.gameTitle}>{game.title}</h2>
              <p className={styles.gameDesc}>{game.description}</p>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(game.path)}
                className={styles.playButton}
              >
                Play
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
