import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './LessonPage.module.css';
import { ArticleLessonPlayer, mockArticleLesson } from '../../../features/lessons/article';
import {
    FlashcardsLessonPlayer,
    mockFlashcardsLesson,
} from '../../../features/lessons/flashcards';
import type { FlashcardsLessonResult } from '../../../features/lessons/flashcards';
import {
    QuizLessonPlayer,
    quizLessonMock,
} from '../../../features/lessons/quiz';
import type { QuizLessonResult } from '../../../features/lessons/quiz';
import {
    ScenarioLessonPlayer,
    japanEtiquetteScenarioMock,
} from '../../../features/lessons/scenario';
import type { ScenarioLessonResult } from '../../../features/lessons/scenario';
import {
    MatchingLessonPlayer,
    mockJapanMatchingLesson,
} from '../../../features/lessons/matching';
import type { MatchingLessonResult } from '../../../features/lessons/matching';
import {
    SummaryLessonPlayer,
    japanDiningSummaryMock,
} from '../../../features/lessons/summary';
import {
    VideoLessonPlayer,
    mockJapanGreetingVideo,
} from '../../../features/lessons/video';
import { JP_COURSE_MOCK } from '../../../features/lessons/mock';

type LessonType =
    | 'article'
    | 'video'
    | 'flashcards'
    | 'quiz'
    | 'scenario'
    | 'matching'
    | 'summary';

function resolveLessonType(lessonId: string | undefined): LessonType {
    if (!lessonId) return 'article';
    if (lessonId.includes('summary')) return 'summary';
    if (lessonId.includes('video')) return 'video';
    if (lessonId.includes('matching')) return 'matching';
    if (lessonId.includes('scenario')) return 'scenario';
    if (lessonId.includes('quiz')) return 'quiz';
    if (lessonId.includes('flash')) return 'flashcards';
    const lesson = JP_COURSE_MOCK.lessons[lessonId];
    if (lesson?.type === 'video') return 'video';
    if (lesson?.type === 'matching') return 'matching';
    if (lesson?.type === 'scenario') return 'scenario';
    if (lesson?.type === 'flashcards') return 'flashcards';
    if (lesson?.type === 'quiz') return 'quiz';
    if (lesson?.type === 'summary') return 'summary';
    return 'article';
}

const ArrowLeftIcon: React.FC = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        width={20}
        height={20}
    >
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
);

const LESSON_LABEL: Record<LessonType, string> = {
    article: 'Article',
    video: 'Video',
    flashcards: 'Flashcards',
    quiz: 'Quiz',
    scenario: 'Scenario',
    matching: 'Matching',
    summary: 'Summary',
};

export const LessonPage: React.FC = () => {
    const { lessonId } = useParams<{ lessonId: string }>();
    const navigate = useNavigate();

    const lessonType = useMemo(() => resolveLessonType(lessonId), [lessonId]);

    const lessonTitle =
        lessonType === 'video'
            ? mockJapanGreetingVideo.title
            : lessonType === 'matching'
                ? mockJapanMatchingLesson.title
                : lessonType === 'scenario'
                    ? japanEtiquetteScenarioMock.title
                    : lessonType === 'quiz'
                        ? quizLessonMock.title
                        : lessonType === 'flashcards'
                            ? mockFlashcardsLesson.title
                            : lessonType === 'summary'
                                ? japanDiningSummaryMock.title
                            : mockArticleLesson.title;

    const handleComplete = () => {
        navigate(-1);
    };

    const handleFlashcardsComplete = (_result: FlashcardsLessonResult) => {
        navigate(-1);
    };

    const handleQuizComplete = (_result: QuizLessonResult) => {
        navigate(-1);
    };

    const handleScenarioComplete = (_result: ScenarioLessonResult) => {
        navigate(-1);
    };

    const handleMatchingComplete = (_result: MatchingLessonResult) => {
        navigate(-1);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <button onClick={handleGoBack} className={styles.backButton} type="button">
                        <ArrowLeftIcon />
                        <span>{LESSON_LABEL[lessonType]}: {lessonTitle}</span>
                    </button>
                </div>
                <div className={styles.titleSpacer} aria-hidden="true" />
                <div className={styles.userInfo}>
                    <span className={styles.userName}>Nurlybek</span>
                    <div className={styles.userAvatar}>N</div>
                </div>
            </header>
            <main className={styles.content}>
                {lessonType === 'video' ? (
                    <VideoLessonPlayer
                        lesson={mockJapanGreetingVideo}
                        onComplete={handleComplete}
                    />
                ) : lessonType === 'matching' ? (
                    <MatchingLessonPlayer
                        lesson={mockJapanMatchingLesson}
                        onComplete={handleMatchingComplete}
                    />
                ) : lessonType === 'scenario' ? (
                    <ScenarioLessonPlayer
                        lesson={japanEtiquetteScenarioMock}
                        onComplete={handleScenarioComplete}
                    />
                ) : lessonType === 'quiz' ? (
                    <QuizLessonPlayer
                        lesson={quizLessonMock}
                        onComplete={handleQuizComplete}
                    />
                ) : lessonType === 'flashcards' ? (
                    <FlashcardsLessonPlayer
                        lesson={mockFlashcardsLesson}
                        onComplete={handleFlashcardsComplete}
                    />
                ) : lessonType === 'summary' ? (
                    <SummaryLessonPlayer
                        lesson={japanDiningSummaryMock}
                        onComplete={handleComplete}
                    />
                ) : (
                    <ArticleLessonPlayer
                        lesson={mockArticleLesson}
                        onComplete={handleComplete}
                    />
                )}
            </main>
        </div>
    );
};
