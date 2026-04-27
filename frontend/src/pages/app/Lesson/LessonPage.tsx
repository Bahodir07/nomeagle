import React, {useEffect, useMemo, useRef, useState, Suspense, lazy} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useQueryClient} from "@tanstack/react-query";
import styles from "./LessonPage.module.css";
import { PageLoader } from "../../../components/feedback";

import type {ArticleLesson} from "../../../features/lessons/article";
import type {FlashcardsLesson, FlashcardsLessonResult} from "../../../features/lessons/flashcards";
import type {QuizLesson} from "../../../features/lessons/quiz";
import type {ScenarioLesson} from "../../../features/lessons/scenario";
import type {MatchingLesson, MatchingLessonResult} from "../../../features/lessons/matching";
import type {SummaryLesson} from "../../../features/lessons/summary";
import type {VideoLesson, VideoTranscriptBlock} from "../../../features/lessons/video";

const ArticleLessonPlayer = lazy(() => import("../../../features/lessons/article").then(m => ({default: m.ArticleLessonPlayer})));
const FlashcardsLessonPlayer = lazy(() => import("../../../features/lessons/flashcards").then(m => ({default: m.FlashcardsLessonPlayer})));
const MatchingLessonPlayer = lazy(() => import("../../../features/lessons/matching").then(m => ({default: m.MatchingLessonPlayer})));
const QuizLessonPlayer = lazy(() => import("../../../features/lessons/quiz").then(m => ({default: m.QuizLessonPlayer})));
const ScenarioLessonPlayer = lazy(() => import("../../../features/lessons/scenario").then(m => ({default: m.ScenarioLessonPlayer})));
const SummaryLessonPlayer = lazy(() => import("../../../features/lessons/summary").then(m => ({default: m.SummaryLessonPlayer})));
const VideoLessonPlayer = lazy(() => import("../../../features/lessons/video").then(m => ({default: m.VideoLessonPlayer})));

import {
    getFlashcards,
    getLesson,
    getMatchingPairs,
    getQuizQuestions,
    getScenarios,
} from "../../../app/api/content";
import {
    completeLesson,
    submitQuizQuestion,
    submitScenario,
    type ProgressSnapshot,
} from "../../../app/api/progress";
import { useAuth } from "../../../app/store/auth.store";

type LessonType =
    | "article"
    | "video"
    | "flashcards"
    | "quiz"
    | "scenario"
    | "matching"
    | "summary";

type LocationState = {
    countrySlug?: string;
    moduleSlug?: string;
    lessonSlug?: string;
    lessonType?: LessonType;
    lessonTitle?: string;
};

type NextLesson = {
    slug: string;
    title: string;
    type: string;
    moduleSlug: string;
    countrySlug: string;
    estimatedMinutes?: number | null;
};

type ApiLesson = {
    id: number | string;
    title: string;
    slug?: string;
    type?: string;
    description?: string | null;
    content?: Record<string, any> | null;
    xp_reward?: number | string | null;
    video_file?: string | null;
    external_video_url?: string | null;
    next_lesson?: NextLesson | null;
};

type ApiScenarioOption = {
    id?: string | number;
    text?: string;
    label?: string;
    is_correct?: boolean;
    explanation?: string;
};

type ApiScenario = {
    id?: number | string;
    slug?: string;
    title?: string;
    prompt?: string;
    payload?: {
        options?: ApiScenarioOption[];
    };
};

type ApiQuizOption = {
    id?: string | number;
    text?: string;
    label?: string;
    is_correct?: boolean;
};

type ApiQuizQuestion = {
    id?: number | string;
    question?: string;
    explanation?: string;
    options?: ApiQuizOption[];
};

type ApiFlashcard = {
    id?: number | string;
    front_text?: string;
    back_text?: string;
};

type CompletionSummary = {
    title: string;
    xpEarned: number;
    starsEarned: number;
    progressPct: number;
    correctCount?: number;
    totalCount?: number;
    nextLesson?: NextLesson | null;
};

type LoadState =
    | { status: "loading" }
    | { status: "error"; error: string }
    | { status: "success"; lessonType: "article"; lessonTitle: string; payload: ArticleLesson }
    | { status: "success"; lessonType: "video"; lessonTitle: string; payload: VideoLesson }
    | { status: "success"; lessonType: "summary"; lessonTitle: string; payload: SummaryLesson }
    | { status: "success"; lessonType: "scenario"; lessonTitle: string; payload: ScenarioLesson }
    | { status: "success"; lessonType: "quiz"; lessonTitle: string; payload: QuizLesson }
    | { status: "success"; lessonType: "flashcards"; lessonTitle: string; payload: FlashcardsLesson }
    | { status: "success"; lessonType: "matching"; lessonTitle: string; payload: MatchingLesson };

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
        <line x1="19" y1="12" x2="5" y2="12"/>
        <polyline points="12 19 5 12 12 5"/>
    </svg>
);

const LESSON_LABEL: Record<LessonType, string> = {
    article: "Article",
    video: "Video",
    flashcards: "Flashcards",
    quiz: "Quiz",
    scenario: "Scenario",
    matching: "Matching",
    summary: "Summary",
};

function normalizeLessonType(type: unknown): LessonType {
    const value = String(type ?? "").toLowerCase();

    if (value === "video") return "video";
    if (value === "flashcards") return "flashcards";
    if (value === "quiz") return "quiz";
    if (value === "scenario") return "scenario";
    if (value === "summary") return "summary";
    if (value === "matching") return "matching";

    return "article";
}

function mapArticleLesson(apiLesson: ApiLesson): ArticleLesson {
    const body = String(apiLesson?.content?.body ?? "");
    const paragraphs = body
        .split(/\n{2,}/)
        .map((item) => item.trim())
        .filter(Boolean);

    return {
        lessonId: String(apiLesson.id),
        title: apiLesson.title,
        pages: [
            {
                id: `article-page-${apiLesson.id}-1`,
                imageUrl: apiLesson?.content?.hero_image_url || undefined,
                paragraphs:
                    paragraphs.length > 0 ? paragraphs : [apiLesson.description || ""],
            },
        ],
    };
}

function mapVideoLesson(apiLesson: ApiLesson): VideoLesson {
    const transcriptText = String(apiLesson?.content?.transcript ?? "");
    const transcript: VideoTranscriptBlock[] = transcriptText
        .split(/\n+/)
        .map((line: string) => line.trim())
        .filter(Boolean)
        .map((text: string, index: number) => ({
            id: `tb-${index + 1}`,
            text,
        }));

    const backendUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/"; // или твой домен

    const filePath = apiLesson?.video_file
        ? `${backendUrl}/storage/${String(apiLesson.video_file).replace(/^\/+/, "")}`
        : null;

    return {
        lessonId: String(apiLesson.id),
        title: apiLesson.title,
        description: apiLesson.description || apiLesson?.content?.summary || "",
        videoUrl: apiLesson.external_video_url || filePath || "",
        thumbnailUrl: apiLesson?.content?.thumbnail_url || undefined,
        durationSeconds: Number(apiLesson?.content?.duration_seconds ?? 0),
        transcript,
        completionThresholdPct: 90,
        xpReward: Number(apiLesson?.xp_reward ?? 0),
    };
}

function mapSummaryLesson(apiLesson: ApiLesson): SummaryLesson {
    return {
        lessonId: String(apiLesson.id),
        title: apiLesson.title,
        summaryText:
            apiLesson?.content?.summary_text ||
            apiLesson?.content?.summary ||
            apiLesson.description ||
            "",
        imageUrl: apiLesson?.content?.hero_image_url || undefined,
        buttonLabel: "Finish",
        xpReward: Number(apiLesson?.xp_reward ?? 0),
    };
}

function mapScenarioLesson(
    apiLesson: ApiLesson,
    scenarios: ApiScenario[]
): ScenarioLesson {
    return {
        lessonId: String(apiLesson.id),
        title: apiLesson.title,
        introText:
            apiLesson.description ||
            "Choose the most respectful action in each situation.",
        xpReward: Number(apiLesson?.xp_reward ?? 0),
        steps: scenarios.map((scenario, index) => {
            const options = Array.isArray(scenario?.payload?.options)
                ? scenario.payload.options
                : [];

            const normalizedChoices = options
                .map((option, optionIndex) => ({
                    id: String(option?.id ?? `option-${optionIndex + 1}`),
                    text: String(option?.text ?? option?.label ?? ""),
                    correct: Boolean(option?.is_correct),
                    correctMessage: Boolean(option?.is_correct)
                        ? String(option?.explanation ?? "Correct.")
                        : "",
                    wrongMessage: !option?.is_correct
                        ? String(option?.explanation ?? "Try again.")
                        : "",
                }))
                .filter((choice) => choice.text.trim() !== "");

            return {
                id: String(scenario?.id ?? `scenario-${index + 1}`),
                slug: scenario?.slug ? String(scenario.slug) : undefined,
                title: String(scenario?.title ?? `Scenario ${index + 1}`),
                description: String(scenario?.prompt ?? ""),
                imageUrl: undefined,
                choices: normalizedChoices,
            };
        }),
    };
}

function mapQuizLesson(
    apiLesson: ApiLesson,
    questions: ApiQuizQuestion[]
): QuizLesson {
    return {
        lessonId: String(apiLesson.id),
        title: apiLesson.title,
        xpPerCorrect: Number(apiLesson?.xp_reward ?? 0) || 10,
        questions: questions.map((question, index) => {
            const options = Array.isArray(question?.options) ? question.options : [];

            const normalizedOptions = options
                .map((option, optionIndex) => ({
                    id: String(option?.id ?? `option-${optionIndex + 1}`),
                    text: String(option?.text ?? option?.label ?? ""),
                }))
                .filter((option) => option.text.trim() !== "");

            const correctOption = options.find((option) => option?.is_correct);

            return {
                id: String(question?.id ?? `question-${index + 1}`),
                prompt: String(question?.question ?? ""),
                options: normalizedOptions as [any, any, any, any],
                correctOptionId: String(correctOption?.id ?? normalizedOptions[0]?.id ?? ""),
                explanation: question?.explanation || undefined,
            };
        }),
    };
}

function mapFlashcardsLesson(
    apiLesson: ApiLesson,
    cards: ApiFlashcard[]
): FlashcardsLesson {
    return {
        lessonId: String(apiLesson.id),
        title: apiLesson.title,
        xpPerCard: Math.max(
            1,
            Math.floor(Number(apiLesson?.xp_reward ?? 0) / Math.max(cards.length, 1))
        ),
        masteryTargetPct: 80,
        cards: cards.map((card, index) => ({
            id: String(card?.id ?? `card-${index + 1}`),
            front: {
                title: String(card?.front_text ?? ""),
            },
            back: {
                explanation: String(card?.back_text ?? ""),
            },
        })),
    };
}

type ApiMatchingPair = {
    id?: number | string;
    left_text?: string;
    right_text?: string;
};

function mapMatchingLesson(
    apiLesson: ApiLesson,
    pairs: ApiMatchingPair[]
): MatchingLesson {
    return {
        lessonId: String(apiLesson.id),
        title: apiLesson.title,
        instruction: apiLesson.description || "Match each item on the left with its pair on the right.",
        contentType: "text",
        xpReward: Number(apiLesson?.xp_reward ?? 0),
        pairs: pairs.map((pair, index) => {
            const pairId = String(pair?.id ?? `pair-${index + 1}`);
            return {
                pairId,
                left: {
                    id: `${pairId}-left`,
                    text: String(pair?.left_text ?? ""),
                },
                right: {
                    id: `${pairId}-right`,
                    text: String(pair?.right_text ?? ""),
                },
            };
        }),
    };
}

function computeStarsFromProgress(progress?: Partial<ProgressSnapshot> | null): number {
    const correctAnswers = Number(progress?.correct_answers ?? 0);
    const totalAttempts = Number(progress?.total_attempts ?? 0);

    if (totalAttempts <= 0) return 0;

    const ratio = correctAnswers / Math.max(totalAttempts, 1);

    if (ratio >= 0.95) return 5;
    if (ratio >= 0.8) return 4;
    if (ratio >= 0.6) return 3;
    if (ratio >= 0.4) return 2;

    return 1;
}

function normalizeXp(value: unknown): number {
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeProgressPct(progress?: Partial<ProgressSnapshot> | null): number {
    const parsed = Number(progress?.progress_pct ?? 0);
    if (!Number.isFinite(parsed)) return 0;
    return Math.max(0, Math.min(100, parsed));
}
export const LessonPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const routeState = (location.state ?? {}) as LocationState;
    const { user } = useAuth();
    const displayName = user?.name ?? 'User';
    const displayInitial = displayName.charAt(0).toUpperCase();

    const queryClient = useQueryClient();
    const [state, setState] = useState<LoadState>({status: "loading"});
    const [isSaving, setIsSaving] = useState(false);
    const [completionSummary, setCompletionSummary] =
        useState<CompletionSummary | null>(null);
    const [nextLesson, setNextLesson] = useState<NextLesson | null>(null);
    const startedAtRef = useRef<number>(Date.now());

    useEffect(() => {
        if (completionSummary) {
            queryClient.invalidateQueries({ queryKey: ["achievements"] });
        }
    }, [completionSummary, queryClient]);

    useEffect(() => {
        const {countrySlug, moduleSlug, lessonSlug, lessonType, lessonTitle} =
            routeState;

        startedAtRef.current = Date.now();
        setCompletionSummary(null);
        setNextLesson(null);

        if (!countrySlug || !moduleSlug || !lessonSlug) {
            setState({
                status: "error",
                error: "Lesson route data is missing. Open the lesson from the learning path page.",
            });
            return;
        }

        const load = async () => {
            try {
                setState({status: "loading"});

                const apiLesson = (await getLesson(
                    countrySlug,
                    moduleSlug,
                    lessonSlug
                )) as ApiLesson;

                if (apiLesson.next_lesson) {
                    setNextLesson(apiLesson.next_lesson);
                }

                const normalizedType = normalizeLessonType(
                    lessonType ?? apiLesson.type
                );
                const normalizedTitle = String(
                    lessonTitle ?? apiLesson.title ?? "Lesson"
                );

                if (normalizedType === "video") {
                    setState({
                        status: "success",
                        lessonType: "video",
                        lessonTitle: normalizedTitle,
                        payload: mapVideoLesson(apiLesson),
                    });
                    return;
                }

                if (normalizedType === "summary") {
                    setState({
                        status: "success",
                        lessonType: "summary",
                        lessonTitle: normalizedTitle,
                        payload: mapSummaryLesson(apiLesson),
                    });
                    return;
                }

                if (normalizedType === "article") {
                    setState({
                        status: "success",
                        lessonType: "article",
                        lessonTitle: normalizedTitle,
                        payload: mapArticleLesson(apiLesson),
                    });
                    return;
                }

                if (normalizedType === "scenario") {
                    const scenarios = (await getScenarios(
                        countrySlug,
                        moduleSlug,
                        lessonSlug
                    )) as ApiScenario[];

                    setState({
                        status: "success",
                        lessonType: "scenario",
                        lessonTitle: normalizedTitle,
                        payload: mapScenarioLesson(apiLesson, scenarios),
                    });
                    return;
                }

                if (normalizedType === "quiz") {
                    const questions = (await getQuizQuestions(
                        countrySlug,
                        moduleSlug,
                        lessonSlug
                    )) as ApiQuizQuestion[];

                    setState({
                        status: "success",
                        lessonType: "quiz",
                        lessonTitle: normalizedTitle,
                        payload: mapQuizLesson(apiLesson, questions),
                    });
                    return;
                }

                if (normalizedType === "flashcards") {
                    const cards = (await getFlashcards(
                        countrySlug,
                        moduleSlug,
                        lessonSlug
                    )) as ApiFlashcard[];

                    setState({
                        status: "success",
                        lessonType: "flashcards",
                        lessonTitle: normalizedTitle,
                        payload: mapFlashcardsLesson(apiLesson, cards),
                    });
                    return;
                }

                if (normalizedType === "matching") {
                    const pairs = (await getMatchingPairs(
                        countrySlug,
                        moduleSlug,
                        lessonSlug
                    )) as ApiMatchingPair[];

                    setState({
                        status: "success",
                        lessonType: "matching",
                        lessonTitle: normalizedTitle,
                        payload: mapMatchingLesson(apiLesson, pairs),
                    });
                    return;
                }

                setState({
                    status: "error",
                    error: `Lesson type "${normalizedType}" is not supported yet.`,
                });
            } catch (error: any) {
                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to load lesson.";

                setState({
                    status: "error",
                    error: message,
                });
            }
        };

        void load();
    }, [
        routeState.countrySlug,
        routeState.moduleSlug,
        routeState.lessonSlug,
        routeState.lessonType,
        routeState.lessonTitle,
    ]);

    const pageLabel = useMemo(() => {
        if (state.status !== "success") {
            return "Lesson";
        }

        return LESSON_LABEL[state.lessonType] ?? "Lesson";
    }, [state]);

    const pageTitle = useMemo(() => {
        if (state.status !== "success") {
            return "Loading...";
        }

        return state.lessonTitle;
    }, [state]);

    const goBackToLearningPath = () => {
        const {countrySlug} = routeState;

        if (!countrySlug) {
            navigate("/app/dashboard", {replace: true});
            return;
        }

        navigate(`/app/countries/${countrySlug}/learn`, {
            replace: true,
            state: {refreshAt: Date.now()},
        });
    };

    const durationSeconds = () =>
        Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1000));

    const savePlainCompletion = async () => {
        if (isSaving) return;

        const {countrySlug, moduleSlug, lessonSlug} = routeState;

        if (!countrySlug || !moduleSlug || !lessonSlug) {
            goBackToLearningPath();
            return;
        }

        try {
            setIsSaving(true);

            const response = await completeLesson(
                countrySlug,
                moduleSlug,
                lessonSlug,
                durationSeconds()
            );

            const xpEarned = normalizeXp(
                response?.xp_earned ??
                response?.progress?.xp_earned ??
                (state.status === "success" ? (state.payload as any)?.xpReward : 0)
            );

            setCompletionSummary({
                title:
                    state.status === "success"
                        ? state.lessonTitle
                        : "Lesson completed",
                xpEarned,
                starsEarned: 0,
                progressPct: normalizeProgressPct(response?.progress) || 100,
                nextLesson,
            });
        } catch (error) {
            console.error("Failed to save lesson progress", error);
            goBackToLearningPath();
        } finally {
            setIsSaving(false);
        }
    };

    const handleComplete = async () => {
        await savePlainCompletion();
    };

    const handleScenarioComplete = async (result: any) => {
        if (isSaving) return;

        try {
            setIsSaving(true);

            let totalXp = result.xpEarned || 0;
            let finalStars = computeStarsFromProgress({
                correct_answers: result.correctCount || result.correctSteps || 0,
                total_attempts: result.totalSteps || result.totalCount || 1,
            });

            if (result.answers && Array.isArray(result.answers) && result.answers.length > 0) {
                let lastProgress: ProgressSnapshot | null = null;
                totalXp = 0;

                for (const answer of result.answers) {
                    const targetScenario = answer.scenarioSlug || answer.scenarioId || answer.id;
                    const targetAnswer = answer.answerId || answer.selectedOptionId || answer.optionId;
                    if (!targetScenario || !targetAnswer) continue;

                    const response = await submitScenario(targetScenario, targetAnswer, durationSeconds());
                    totalXp += normalizeXp(response?.xp_earned);
                    lastProgress = response?.progress ?? null;
                }
                if (lastProgress) finalStars = computeStarsFromProgress(lastProgress);
            } else {
                const { countrySlug, moduleSlug, lessonSlug } = routeState;
                if (countrySlug && moduleSlug && lessonSlug) {
                    const correctCount = result.correctCount || result.correctSteps || 0;
                    const totalCount = result.totalSteps || result.totalCount || 1;
                    const response = await completeLesson(
                        countrySlug, moduleSlug, lessonSlug, durationSeconds(),
                        correctCount, totalCount
                    );
                    totalXp = normalizeXp(response?.xp_earned) || totalXp;
                    if (response?.progress) finalStars = computeStarsFromProgress(response.progress);
                }
            }

            setCompletionSummary({
                title: state.status === "success" ? state.lessonTitle : "Scenario completed",
                xpEarned: totalXp,
                starsEarned: finalStars,
                progressPct: 100,
                correctCount: result.correctCount || result.correctSteps || 0,
                totalCount: result.totalSteps || result.totalCount || 0,
                nextLesson,
            });

        } catch (error) {
            console.error("Failed to submit scenario answers", error);
            goBackToLearningPath();
        } finally {
            setIsSaving(false);
        }
    };
    const handleQuizComplete = async (result: any) => {
        if (isSaving) return;

        try {
            setIsSaving(true);

            const rawAnswers = Array.isArray(result) ? result
                : Array.isArray(result?.answers) ? result.answers
                    : Array.isArray(result?.responses) ? result.responses
                        : Array.isArray(result?.selectedAnswers) ? result.selectedAnswers
                            : [];

            if (rawAnswers.length === 0) {
                const { countrySlug, moduleSlug, lessonSlug } = routeState;
                if (countrySlug && moduleSlug && lessonSlug) {
                    await completeLesson(countrySlug, moduleSlug, lessonSlug, durationSeconds());
                }

                setCompletionSummary({
                    title: state.status === "success" ? state.lessonTitle : "Quiz completed",
                    xpEarned: result?.xpEarned || 0,
                    starsEarned: computeStarsFromProgress({
                        correct_answers: result?.correctCount || result?.correctAnswers || 0,
                        total_attempts: result?.totalCount || result?.totalQuestions || 1,
                    }),
                    progressPct: result?.progressPct || 100,
                    correctCount: result?.correctCount || result?.correctAnswers || 0,
                    totalCount: result?.totalCount || result?.totalQuestions || 0,
                    nextLesson,
                });
                return;
            }

            let totalXp = 0;
            let lastProgress: ProgressSnapshot | null = null;

            for (const answer of rawAnswers) {
                if (!answer) continue;

                const targetQuestion = answer.questionId || answer.id || answer.quizQuestionId;
                const targetAnswer = answer.answerId || answer.selectedOptionId || answer.optionId;

                if (!targetQuestion || !targetAnswer) continue;

                const response = await submitQuizQuestion(targetQuestion, targetAnswer, durationSeconds());

                totalXp += normalizeXp(response?.xp_earned);
                lastProgress = response?.progress ?? null;
            }

            setCompletionSummary({
                title: state.status === "success" ? state.lessonTitle : "Quiz completed",
                xpEarned: totalXp,
                starsEarned: computeStarsFromProgress(lastProgress),
                progressPct: normalizeProgressPct(lastProgress) || 100,
                correctCount: result?.correctCount || result?.correctAnswers || 0,
                totalCount: result?.totalCount || result?.totalQuestions || rawAnswers.length,
                nextLesson,
            });

        } catch (error) {
            console.error("Failed to submit quiz answers", error);
            goBackToLearningPath();
        } finally {
            setIsSaving(false);
        }
    };
    const handleFlashcardsComplete = async (
        _result: FlashcardsLessonResult
    ) => {
        await savePlainCompletion();
    };

    const handleMatchingComplete = async (result: MatchingLessonResult) => {
        if (isSaving) return;

        const { countrySlug, moduleSlug, lessonSlug } = routeState;
        if (!countrySlug || !moduleSlug || !lessonSlug) {
            goBackToLearningPath();
            return;
        }

        try {
            setIsSaving(true);

            const totalPairs = result.totalPairs;
            const attempts   = result.attempts > 0 ? result.attempts : totalPairs;

            const response = await completeLesson(
                countrySlug,
                moduleSlug,
                lessonSlug,
                durationSeconds(),
                totalPairs,
                attempts
            );

            const xpEarned = normalizeXp(
                response?.xp_earned ??
                response?.progress?.xp_earned ??
                (state.status === "success" ? (state.payload as any)?.xpReward : 0)
            );

            const starsEarned = computeStarsFromProgress({
                correct_answers: totalPairs,
                total_attempts: attempts,
            });

            setCompletionSummary({
                title: state.status === "success" ? state.lessonTitle : "Matching completed",
                xpEarned,
                starsEarned,
                progressPct: normalizeProgressPct(response?.progress) || 100,
                correctCount: totalPairs,
                totalCount: attempts,
                nextLesson,
            });
        } catch (error) {
            console.error("Failed to save matching progress", error);
            goBackToLearningPath();
        } finally {
            setIsSaving(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const goToNextLesson = (next: NextLesson) => {
        navigate(`/app/lesson/${next.slug}`, {
            state: {
                countrySlug: next.countrySlug,
                moduleSlug: next.moduleSlug,
                lessonSlug: next.slug,
                lessonType: next.type as LessonType,
                lessonTitle: next.title,
            },
        });
    };

    const renderPlayer = () => {
        if (state.status !== "success") return null;

        switch (state.lessonType) {
            case "video":
                return <VideoLessonPlayer lesson={state.payload} onComplete={handleComplete}/>;
            case "scenario":
                return <ScenarioLessonPlayer lesson={state.payload} onComplete={handleScenarioComplete}/>;
            case "quiz":
                return <QuizLessonPlayer lesson={state.payload} onComplete={handleQuizComplete}/>;
            case "flashcards":
                return <FlashcardsLessonPlayer lesson={state.payload} onComplete={handleFlashcardsComplete}/>;
            case "matching":
                return <MatchingLessonPlayer lesson={state.payload} onComplete={handleMatchingComplete}/>;
            case "summary":
                return <SummaryLessonPlayer lesson={state.payload} onComplete={handleComplete}/>;
            case "article":
                return <ArticleLessonPlayer lesson={state.payload} onComplete={handleComplete}/>;
            default:
                return <div style={{padding: 24}}>Unsupported lesson type</div>;
        }
    };

    if (completionSummary) {
        return (
            <div className={styles.page}>
                <header className={styles.header}>
                    <div>
                        <button
                            onClick={handleGoBack}
                            className={styles.backButton}
                            type="button"
                        >
                            <ArrowLeftIcon/>
                            <span>Lesson Result</span>
                        </button>
                    </div>

                    <div className={styles.titleSpacer} aria-hidden="true"/>

                    <div className={styles.userInfo}>
                        <span className={styles.userName}>{displayName}</span>
                        <div className={styles.userAvatar}>{displayInitial}</div>
                    </div>
                </header>

                <main className={styles.content}>
                    <div className={styles.resultWrapper}>
                        <div className={styles.resultCard}>
                            <div className={styles.resultCheck}>✓</div>
                            <h2 className={styles.resultTitle}>{completionSummary.title}</h2>

                            {completionSummary.correctCount !== undefined &&
                            completionSummary.totalCount !== undefined ? (
                                <p className={styles.resultMeta}>
                                    Correct answers:{" "}
                                    <strong>{completionSummary.correctCount}</strong> /{" "}
                                    {completionSummary.totalCount}
                                </p>
                            ) : null}

                            <div className={styles.resultStats}>
                                <div className={styles.resultStat}>
                                    <span className={styles.resultStatLabel}>XP</span>
                                    <strong className={styles.resultStatValue}>
                                        +{completionSummary.xpEarned}
                                    </strong>
                                </div>

                                <div className={styles.resultStat}>
                                    <span className={styles.resultStatLabel}>Stars</span>
                                    <strong className={styles.resultStatValue}>
                                        {completionSummary.starsEarned}
                                    </strong>
                                </div>

                                <div className={styles.resultStat}>
                                    <span className={styles.resultStatLabel}>Progress</span>
                                    <strong className={styles.resultStatValue}>
                                        {completionSummary.progressPct}%
                                    </strong>
                                </div>
                            </div>

                            {completionSummary.nextLesson ? (
                                <div className={styles.resultActions}>
                                    <button
                                        type="button"
                                        className={styles.resultButtonSecondary}
                                        onClick={goBackToLearningPath}
                                    >
                                        Back to path
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.resultButton}
                                        onClick={() => goToNextLesson(completionSummary.nextLesson!)}
                                    >
                                        Next: {completionSummary.nextLesson.title}
                                        {completionSummary.nextLesson.estimatedMinutes
                                            ? ` · ${completionSummary.nextLesson.estimatedMinutes} min`
                                            : ""}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    className={styles.resultButton}
                                    onClick={goBackToLearningPath}
                                >
                                    Continue
                                </button>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <button
                        onClick={handleGoBack}
                        className={styles.backButton}
                        type="button"
                    >
                        <ArrowLeftIcon/>
                        <span>
                            {pageLabel}: {pageTitle}
                        </span>
                    </button>
                </div>

                <div className={styles.titleSpacer} aria-hidden="true"/>

                <div className={styles.userInfo}>
                    <span className={styles.userName}>
                        {isSaving ? "Saving..." : displayName}
                    </span>
                    <div className={styles.userAvatar}>{isSaving ? "…" : displayInitial}</div>
                </div>
            </header>

            <main className={styles.content}>
                {state.status === "loading" ? (
                    <PageLoader text="Loading lesson..." />
                ) : state.status === "error" ? (
                    <div style={{padding: 24}}>
                        <p>{state.error}</p>
                    </div>
                ) : (
                    <Suspense fallback={<div style={{padding: 24}}>Preparing player...</div>}>
                        {renderPlayer()}
                    </Suspense>
                )}
            </main>
        </div>
    );
};