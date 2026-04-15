import React, { useEffect, useRef, useState } from 'react';
import styles from './FlashcardView.module.css';
import type { Flashcard } from '../../types';

export interface FlashcardViewProps {
    card: Flashcard;
    isFlipped: boolean;
    onFlip: () => void;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({
    card,
    isFlipped,
    onFlip,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | undefined>(undefined);
    const frontRef = useRef<HTMLDivElement>(null);
    const backRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const front = frontRef.current;
        const back = backRef.current;
        if (!front || !back) return;

        const observer = new ResizeObserver(() => {
            const fh = front.scrollHeight;
            const bh = back.scrollHeight;
            setHeight(Math.max(fh, bh));
        });

        observer.observe(front);
        observer.observe(back);
        return () => observer.disconnect();
    }, [card.id]);

    return (
        <div
            className={styles.cardContainer}
            onClick={onFlip}
            onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    onFlip();
                }
            }}
            ref={containerRef}
            role="button"
            tabIndex={0}
            aria-label={isFlipped ? 'Card back shown. Click to flip to front.' : 'Card front shown. Click to flip and reveal answer.'}
        >
            <div
                className={`${styles.cardInner} ${isFlipped ? styles.flipped : ''}`}
                style={height ? { minHeight: height } : undefined}
            >
                <div className={`${styles.cardFace} ${styles.front}`} ref={frontRef}>
                    {card.imageUrl && (
                        <img
                            src={card.imageUrl}
                            alt=""
                            className={styles.image}
                            aria-hidden="true"
                        />
                    )}
                    <h2 className={styles.title}>{card.front.title}</h2>
                    {card.front.subtitle && (
                        <p className={styles.subtitle}>{card.front.subtitle}</p>
                    )}
                    {!isFlipped && (
                        <span className={styles.tapHint}>Press Space or tap to flip</span>
                    )}
                </div>

                <div className={`${styles.cardFace} ${styles.back}`} ref={backRef}>
                    <span className={styles.backLabel}>Answer</span>
                    <p className={styles.explanation}>{card.back.explanation}</p>
                    {card.back.examples && card.back.examples.length > 0 && (
                        <ul className={styles.examplesList}>
                            {card.back.examples.map((ex, i) => (
                                <li key={i} className={styles.exampleItem}>
                                    {ex}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};
