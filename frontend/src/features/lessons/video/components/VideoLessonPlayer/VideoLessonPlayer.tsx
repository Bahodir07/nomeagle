import React, { useCallback } from 'react';
import styles from './VideoLessonPlayer.module.css';
import type { VideoLesson } from '../../types';
import { VideoPlayerCard } from '../VideoPlayerCard';

export interface VideoLessonPlayerProps {
    lesson: VideoLesson;
    onComplete?: () => void;
}

export const VideoLessonPlayer: React.FC<VideoLessonPlayerProps> = ({
    lesson,
    onComplete,
}) => {
    const handleCompleted = useCallback(() => {
        onComplete?.();
    }, [onComplete]);

    if (!lesson.videoUrl) {
        return <div className={styles.empty}>This lesson has no video.</div>;
    }

    return (
        <div className={styles.playerContainer}>
            <VideoPlayerCard lesson={lesson} onCompleted={handleCompleted} />
        </div>
    );
};
