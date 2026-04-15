import React from 'react';
import styles from './TranscriptSection.module.css';
import type { VideoTranscriptBlock } from '../../types';
import { formatVideoTime } from '../../engine/videoProgress.utils';

export interface TranscriptSectionProps {
    transcript: VideoTranscriptBlock[];
    activeBlockId?: string | null;
    onBlockClick?: (block: VideoTranscriptBlock) => void;
}

export const TranscriptSection: React.FC<TranscriptSectionProps> = ({
    transcript,
    activeBlockId,
    onBlockClick,
}) => {
    if (transcript.length === 0) return null;

    const clickable = typeof onBlockClick === 'function';

    return (
        <section className={styles.section} aria-label="Transcript">
            <h3 className={styles.heading}>Transcript</h3>

            <div className={styles.list}>
                {transcript.map((block) => {
                    const isActive = block.id === activeBlockId;

                    const blockClass = [
                        styles.block,
                        clickable ? styles.blockClickable : '',
                        isActive ? styles.blockActive : '',
                    ]
                        .filter(Boolean)
                        .join(' ');

                    return (
                        <div
                            key={block.id}
                            className={blockClass}
                            onClick={clickable ? () => onBlockClick(block) : undefined}
                            role={clickable ? 'button' : undefined}
                            tabIndex={clickable ? 0 : undefined}
                            onKeyDown={
                                clickable
                                    ? (e) => {
                                          if (e.key === 'Enter' || e.key === ' ') {
                                              e.preventDefault();
                                              onBlockClick(block);
                                          }
                                      }
                                    : undefined
                            }
                        >
                            {block.startSeconds !== undefined && (
                                <span className={styles.time}>
                                    {formatVideoTime(block.startSeconds)}
                                </span>
                            )}
                            <p className={styles.text}>{block.text}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
