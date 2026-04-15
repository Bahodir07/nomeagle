import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Tradition } from '../types';
import styles from '../CultureMatchRush.module.css';

interface TraditionCardProps {
  tradition: Tradition;
}

export const TraditionCard: React.FC<TraditionCardProps> = ({ tradition }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: tradition.id,
    data: tradition,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={styles.card}
    >
      <span className={styles.cardEmoji}>{tradition.emoji}</span>
      <p className={styles.cardText}>{tradition.text}</p>
    </div>
  );
};

export const DragOverlayCard: React.FC<{ tradition: Tradition }> = ({ tradition }) => {
  return (
    <div className={styles.overlayCard}>
      <span className={styles.cardEmoji}>{tradition.emoji}</span>
      <p className={styles.cardText}>{tradition.text}</p>
    </div>
  );
};
