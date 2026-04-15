import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './ArticleLessonPlayer.module.css';
import { ArticleLesson } from '../../types';
import { ArticlePageCard } from '../ArticlePageCard';
import { ArticleToolsRail } from '../ArticleToolsRail';
import { ArticleCompletionScreen } from '../ArticleCompletionScreen';
import { SlideNavButton } from '../../../../../components/navigation/SlideNavButton';

const TRANSITION_MS = 450;

export interface ArticleLessonPlayerProps {
    lesson: ArticleLesson;
    initialPage?: number;
    onComplete?: () => void;
    onPageChange?: (nextIndex: number) => void;
}

export const ArticleLessonPlayer: React.FC<ArticleLessonPlayerProps> = ({
    lesson,
    initialPage = 0,
    onComplete,
    onPageChange,
}) => {
    const [currentPageIndex, setCurrentPageIndex] = useState(initialPage);
    const [transition, setTransition] = useState<{
        fromIndex: number;
        toIndex: number;
        direction: 'next' | 'prev';
    } | null>(null);
    const [hasReachedEndOfCard, setHasReachedEndOfCard] = useState(false);
    const [showCompletion, setShowCompletion] = useState(false);
    const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const endSentinelRef = useRef<HTMLDivElement>(null);

    const totalPages = lesson.pages.length;
    const isFirstPage = currentPageIndex === 0;
    const isLastPage = currentPageIndex === totalPages - 1;

    const startTransition = useCallback(
        (fromIndex: number, toIndex: number, direction: 'next' | 'prev') => {
            if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
            setTransition({ fromIndex, toIndex, direction });
            transitionTimeoutRef.current = setTimeout(() => {
                transitionTimeoutRef.current = null;
                setCurrentPageIndex(toIndex);
                setTransition(null);
                setHasReachedEndOfCard(false);
                onPageChange?.(toIndex);
            }, TRANSITION_MS);
        },
        [onPageChange]
    );

    const handleNext = useCallback(() => {
        if (isLastPage) {
            setShowCompletion(true);
        } else if (!transition) {
            const nextIndex = currentPageIndex + 1;
            startTransition(currentPageIndex, nextIndex, 'next');
        }
    }, [currentPageIndex, isLastPage, onComplete, onPageChange, transition, startTransition]);

    const handlePrev = useCallback(() => {
        if (!isFirstPage && !transition) {
            const prevIndex = currentPageIndex - 1;
            startTransition(currentPageIndex, prevIndex, 'prev');
        }
    }, [currentPageIndex, isFirstPage, transition, startTransition]);

    useEffect(() => {
        return () => {
            if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
        };
    }, []);

    // Show "next page" / "finish" label only when user has scrolled to the end of the article card
    useEffect(() => {
        if (transition || endSentinelRef.current === null) return;
        const el = endSentinelRef.current;
        const observer = new IntersectionObserver(
            ([entry]) => setHasReachedEndOfCard(entry.isIntersecting),
            { root: null, rootMargin: '0px', threshold: 0 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [currentPageIndex, transition]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const isInput =
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable;
            if (isInput) return;
            if (e.key === 'ArrowRight') handleNext();
            else if (e.key === 'ArrowLeft') handlePrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev]);

    if (!lesson.pages || lesson.pages.length === 0) {
        return <div className={styles.empty}>Lesson has no pages.</div>;
    }

    if (showCompletion) {
        return (
            <div className={[styles.playerContainer, styles.playerContainerCompletion].join(' ')}>
                <ArticleCompletionScreen onContinue={() => onComplete?.()} />
            </div>
        );
    }

    const displayIndex = transition ? transition.fromIndex : currentPageIndex;
    const isFirstPageDisplay = displayIndex === 0;
    const isLastPageDisplay = displayIndex === totalPages - 1;

    const renderSlide = (
        pageIndex: number,
        animationClass: string | undefined,
        sentinelRef?: React.RefObject<HTMLDivElement>
    ) => {
        const page = lesson.pages[pageIndex];
        return (
            <div key={page.id} className={styles.slide}>
                <div className={[styles.cardWrapper, animationClass].filter(Boolean).join(' ')}>
                    <ArticlePageCard
                        title={lesson.title}
                        imageUrl={page.imageUrl}
                        paragraphs={page.paragraphs}
                        showTitle={pageIndex === 0}
                    />
                    <div
                        ref={sentinelRef}
                        className={styles.endSentinel}
                        aria-hidden="true"
                    />
                </div>
            </div>
        );
    };

    return (
        <div className={styles.playerContainer}>
            <div className={styles.navPrev}>
                <SlideNavButton
                    direction="prev"
                    label="previous page"
                    disabled={isFirstPageDisplay}
                    onClick={handlePrev}
                />
            </div>

            <div className={styles.contentArea}>
                <div className={styles.sliderWrapper}>
                    <div
                        className={[styles.slideStage, !transition && styles.idle]
                            .filter(Boolean)
                            .join(' ')}
                    >
                        {transition ? (
                            <>
                                <div
                                    className={[
                                        styles.slideLayer,
                                        styles.entering,
                                        transition.direction === 'next'
                                            ? styles.enteringNext
                                            : styles.enteringPrev,
                                    ].join(' ')}
                                >
                                    {renderSlide(transition.toIndex, undefined)}
                                </div>
                                <div
                                    className={[
                                        styles.slideLayer,
                                        styles.exiting,
                                        transition.direction === 'next'
                                            ? styles.exitingNext
                                            : styles.exitingPrev,
                                    ].join(' ')}
                                >
                                    {renderSlide(transition.fromIndex, undefined)}
                                </div>
                            </>
                        ) : (
                            renderSlide(currentPageIndex, undefined, endSentinelRef)
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.toolsRail}>
                <ArticleToolsRail
                    pageIndex={displayIndex}
                    totalPages={totalPages}
                />
            </div>

            <div className={styles.navNext}>
                <SlideNavButton
                    direction="next"
                    label={isLastPageDisplay ? 'finish' : 'next page'}
                    onClick={handleNext}
                    isFinish={isLastPageDisplay}
                    showLabel={hasReachedEndOfCard}
                />
            </div>
        </div>
    );
};
