import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Category } from '../types';
import styles from '../CultureMatchRush.module.css';

interface DropZoneProps {
  category: Category;
}

export const DropZone: React.FC<DropZoneProps> = ({ category }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: category.id,
    data: category,
  });

  return (
    <div
      ref={setNodeRef}
      className={styles.dropZone}
      style={{
        border: `4px solid ${isOver ? '#fff' : 'rgba(255,255,255,0.4)'}`,
        backgroundColor: category.color,
        opacity: isOver ? 1 : 0.88,
        transform: isOver ? 'scale(1.06)' : 'scale(1)',
        boxShadow: isOver
          ? '0 0 30px rgba(255,255,255,0.35), 0 8px 32px rgba(0,0,0,0.3)'
          : '0 4px 20px rgba(0,0,0,0.25)',
      }}
    >
      <div className={styles.dropZoneInner}>
        <h3 className={styles.dropZoneTitle}>
          {category.title}
        </h3>
      </div>
      <div style={{ flex: 1 }} />
      {isOver && <div className={styles.dropZoneOutline} />}
    </div>
  );
};
