import React from 'react';
import styles from './ArticlePageCard.module.css';

export interface ArticlePageCardProps {
    title: string;
    imageUrl?: string;
    paragraphs: string[];
    /** Show the title on the card (e.g. only on first page). Default true. */
    showTitle?: boolean;
}

export const ArticlePageCard: React.FC<ArticlePageCardProps> = ({
    title,
    imageUrl,
    paragraphs,
    showTitle = true,
}) => {
    return (
        <div className={styles.card}>
            {showTitle && <h1 className={styles.title}>{title}</h1>}

            {imageUrl && (
                <div className={styles.imageContainer}>
                    <img src={imageUrl} alt="" className={styles.image} aria-hidden="true" />
                </div>
            )}

            <div className={styles.content}>
                {paragraphs.map((paragraph, index) => (
                    <p key={index} className={styles.paragraph}>
                        {paragraph}
                    </p>
                ))}
            </div>
        </div>
    );
};
