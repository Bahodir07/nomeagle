import React, { useRef, useState, useCallback } from 'react';
import styles from './VideoPlayerCard.module.css';
import type { VideoLesson, VideoTranscriptBlock } from '../../types';
import {
    getWatchedPct,
    isVideoCompleted,
    formatVideoTime,
} from '../../engine/videoProgress.utils';
import { TranscriptSection } from '../TranscriptSection';

export interface VideoPlayerCardProps {
    lesson: VideoLesson;
    onCompleted?: () => void;
}

export const VideoPlayerCard: React.FC<VideoPlayerCardProps> = ({
    lesson,
    onCompleted,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [completed, setCompleted] = useState(false);
    const completedFired = useRef(false);

    const watchedPct = getWatchedPct(currentTime, lesson.durationSeconds);

    const markComplete = useCallback(() => {
        if (completedFired.current) return;
        completedFired.current = true;
        setCompleted(true);
    }, []);

    const handleTimeUpdate = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        const time = video.currentTime;
        setCurrentTime(time);

        if (isVideoCompleted(time, lesson.durationSeconds, lesson.completionThresholdPct)) {
            markComplete();
        }
    }, [lesson.durationSeconds, lesson.completionThresholdPct, markComplete]);

    const handleEnded = useCallback(() => {
        setCurrentTime(lesson.durationSeconds);
        markComplete();
    }, [lesson.durationSeconds, markComplete]);

    const seekTo = useCallback((block: VideoTranscriptBlock) => {
        const video = videoRef.current;
        if (!video || block.startSeconds === undefined) return;
        video.currentTime = block.startSeconds;
        video.play();
    }, []);

    const activeBlockId = getActiveBlockId(lesson.transcript, currentTime);

    const cardClass = completed
        ? `${styles.card} ${styles.cardCompleted}`
        : styles.card;

    return (
        <div className={cardClass}>
            {/* Video */}
            <div className={styles.videoWrapper}>
                <video
                    ref={videoRef}
                    className={styles.video}
                    src={lesson.videoUrl}
                    poster={lesson.thumbnailUrl}
                    controls
                    preload="metadata"
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleEnded}
                />
            </div>

            <div className={styles.body}>
                {/* Title + description */}
                <h2 className={styles.title}>{lesson.title}</h2>
                <p className={styles.description}>{lesson.description}</p>

                {/* Progress */}
                <div className={styles.progress}>
                    <div className={styles.progressBar}>
                        <div
                            className={
                                completed
                                    ? `${styles.progressFill} ${styles.progressFillComplete}`
                                    : styles.progressFill
                            }
                            style={{ width: `${watchedPct}%` }}
                        />
                    </div>

                    <div className={styles.progressMeta}>
                        <span className={styles.timeLabel}>
                            {formatVideoTime(currentTime)} / {formatVideoTime(lesson.durationSeconds)}
                        </span>

                        <span
                            className={
                                completed
                                    ? `${styles.pctLabel} ${styles.pctLabelComplete}`
                                    : styles.pctLabel
                            }
                        >
                            {watchedPct}%
                        </span>
                    </div>
                </div>

                {/* Completion banner */}
                {completed && (
                    <div className={styles.completionBanner}>
                        <span className={styles.completionIcon} aria-hidden="true">
                            &#10003;
                        </span>
                        <div className={styles.completionContent}>
                            <p className={styles.completionTitle}>Lesson complete!</p>
                            <p className={styles.completionSubtitle}>
                                You earned +{lesson.xpReward} XP
                            </p>
                        </div>
                    </div>
                )}

                {/* Transcript */}
                <TranscriptSection
                    transcript={lesson.transcript}
                    activeBlockId={activeBlockId}
                    onBlockClick={seekTo}
                />

                {/* Continue button — only after completion */}
                {completed && (
                    <button
                        className={styles.continueButton}
                        onClick={onCompleted}
                        type="button"
                    >
                        Continue &mdash; +{lesson.xpReward} XP
                    </button>
                )}
            </div>
        </div>
    );
};

function getActiveBlockId(
    transcript: VideoTranscriptBlock[],
    currentTime: number,
): string | null {
    for (let i = transcript.length - 1; i >= 0; i--) {
        const block = transcript[i];
        if (
            block.startSeconds !== undefined &&
            currentTime >= block.startSeconds
        ) {
            if (block.endSeconds === undefined || currentTime < block.endSeconds) {
                return block.id;
            }
        }
    }
    return null;
}
