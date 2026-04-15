import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useGameStore } from '../store/useGameStore';
import { DropZone } from './DropZone';
import { DragOverlayCard, TraditionCard } from './TraditionCard';
import { Tradition } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../CultureMatchRush.module.css';

export const GameBoard: React.FC = () => {
  const { level, cards, currentCardIndex, handleMatch } = useGameStore();
  const [activeCard, setActiveCard] = useState<Tradition | null>(null);
  const [cardStartTime, setCardStartTime] = useState<number>(Date.now());

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  if (!level) return null;

  const activeTradition = cards[currentCardIndex];
  const cardsRemaining = cards.length - currentCardIndex;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveCard(event.active.data.current as Tradition);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
    if (!over) return;
    const cardData = active.data.current as Tradition;
    const isCorrect = over.id === cardData.categoryId;
    const timeSinceAppeared = (Date.now() - cardStartTime) / 1000;
    handleMatch(isCorrect, timeSinceAppeared, cardData);
    setCardStartTime(Date.now());
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={styles.board}>
        <div className={styles.dropZonesRow}>
          {level.categories.map((cat) => (
            <DropZone key={cat.id} category={cat} />
          ))}
        </div>

        <div className={styles.deckLabel}>
          DECK: <span style={{ opacity: 0.8 }}>{cardsRemaining} cards left</span>
        </div>

        <div className={styles.activeCardArea}>
          <AnimatePresence mode="popLayout">
            {activeTradition && (
              <motion.div
                key={activeTradition.id}
                initial={{ scale: 0, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.7, opacity: 0, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', bounce: 0.35, duration: 0.5 }}
              >
                <TraditionCard tradition={activeTradition} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeCard ? <DragOverlayCard tradition={activeCard} /> : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};
