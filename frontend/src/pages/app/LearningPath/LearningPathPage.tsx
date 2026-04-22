import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import {
    CourseHeader,
    ModuleSection,
    LessonGrid,
    LessonCard,
    CourseNavigator,
    moduleElementId,
} from "../../../features/lessons/components";
import {
    computeLessonStatuses,
    computeCourseSummary,
    lessonStatusMap,
} from "../../../features/lessons/engine";
import type { UserCourseProgress } from "../../../features/lessons/engine";
import type { CountryCourse } from "../../../features/lessons/types";
import { getLearningPath } from "../../../app/api/content";
import styles from "./LearningPathPage.module.css";
import { PageLoader } from "../../../components/feedback";

/* ---------- Inline SVG ---------- */

const ArrowLeftIcon: React.FC = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
);

type LoadState =
    | { status: "loading" }
    | { status: "error"; error: string }
    | {
    status: "success";
    course: CountryCourse;
    progress: UserCourseProgress;
};

const EMPTY_PROGRESS: UserCourseProgress = {
    completedLessonIds: [],
    starsByLessonId: {},
    lastOpenedLessonId: undefined,
};

/* ---------- Component ---------- */

export const LearningPathPage: React.FC = () => {
    const { countryCode } = useParams<{ countryCode: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const [state, setState] = useState<LoadState>({ status: "loading" });

    useEffect(() => {
        if (!countryCode) {
            setState({
                status: "error",
                error: "Country code is missing.",
            });
            return;
        }

        const load = async () => {
            try {
                setState({ status: "loading" });

                const data = await getLearningPath(countryCode);

                setState({
                    status: "success",
                    course: data.course,
                    progress: {
                        completedLessonIds: data.progress.completedLessonIds ?? [],
                        starsByLessonId: data.progress.starsByLessonId ?? {},
                        lastOpenedLessonId: data.progress.lastOpenedLessonId ?? undefined,
                    },
                });
            } catch (error: any) {
                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to load learning path.";

                setState({
                    status: "error",
                    error: message,
                });
            }
        };

        void load();
    }, [countryCode, (location.state as any)?.refreshAt]);

    const course = state.status === "success" ? state.course : null;
    const progress = state.status === "success" ? state.progress : EMPTY_PROGRESS;

    /* ---- Engine computations: always call hooks ---- */

    const statusList = useMemo(() => {
        if (!course) return [];
        return computeLessonStatuses(course, progress);
    }, [course, progress]);

    const statusById = useMemo(() => {
        return lessonStatusMap(statusList);
    }, [statusList]);

    const summary = useMemo(() => {
        if (!course) {
            return {
                completedCount: 0,
                totalCount: 0,
                progressPct: 0,
                starsTotal: 0,
                pointsTotal: 0,
            };
        }

        return computeCourseSummary(course, progress);
    }, [course, progress]);

    const moduleCompletedCounts = useMemo(() => {
        if (!course) return {};

        const counts: Record<string, number> = {};

        for (const mod of course.modules) {
            counts[mod.id] = mod.lessonIds.filter(
                (lid) => statusById[lid]?.status === "completed"
            ).length;
        }

        return counts;
    }, [course, statusById]);

    const navigatorModules = useMemo(() => {
        if (!course) return [];
        return course.modules.map((m) => ({ id: m.id, title: m.title }));
    }, [course]);

    /* ---- Handlers ---- */

    const handleLessonClick = (lessonId: string) => {
        if (!course) return;

        const lesson = course.lessons[lessonId];
        const lessonState = statusById[lessonId];

        if (!lesson || !lessonState || lessonState.status === "locked") {
            return;
        }

        navigate(`/app/lesson/${lessonId}`, {
            state: {
                countrySlug: course.countrySlug,
                moduleSlug: lesson.moduleSlug,
                lessonSlug: lesson.slug,
                lessonType: lesson.type,
                lessonTitle: lesson.title,
            },
        });
    };
    /* ---- Render states ---- */

    if (state.status === "loading") {
        return (
            <div className={styles.page}>
                <Link to="/app/dashboard" className={styles.backLink}>
                    <ArrowLeftIcon />
                    Go Back
                </Link>

                <div className={styles.container}>
                    <PageLoader text="Loading learning path..." variant="inverted" />
                </div>
            </div>
        );
    }

    if (state.status === "error") {
        return (
            <div className={styles.page}>
                <Link to="/app/dashboard" className={styles.backLink}>
                    <ArrowLeftIcon />
                    Go Back
                </Link>

                <div className={styles.container}>
                    <p>{state.error}</p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: "12px",
                            padding: "10px 14px",
                            borderRadius: "10px",
                            border: "1px solid var(--ne-border, #d1d5db)",
                            background: "var(--ne-surface, #fff)",
                            cursor: "pointer",
                        }}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!course) {
        return null;
    }

    return (
        <div className={styles.page}>
            <Link to="/app/dashboard" className={styles.backLink}>
                <ArrowLeftIcon />
                Go Back
            </Link>

            <div className={styles.container}>
                <CourseHeader
                    countryCode={course.countryCode}
                    countryName={course.countryName}
                    completedCount={summary.completedCount}
                    totalCount={summary.totalCount}
                    progressPct={summary.progressPct}
                    starsTotal={summary.starsTotal}
                    pointsTotal={summary.pointsTotal}
                    flagUrl={course.flagUrl}
                    flagEmoji={course.flagEmoji}
                />

                {course.modules.map((mod, moduleIndex) => (
                    <div
                        key={mod.id}
                        id={moduleElementId(moduleIndex)}
                        className={styles.moduleWrap}
                    >
                        <ModuleSection
                            title={mod.title}
                            rangeLabel={mod.rangeLabel}
                            completedCount={moduleCompletedCounts[mod.id] ?? 0}
                            totalCount={mod.lessonIds.length}
                        >
                            <LessonGrid>
                                {mod.lessonIds.map((lid) => {
                                    const lesson = course.lessons[lid];
                                    const lessonState = statusById[lid];

                                    if (!lesson || !lessonState) return null;

                                    return (
                                        <LessonCard
                                            key={lid}
                                            id={lid}
                                            index={lesson.index}
                                            type={lesson.type}
                                            shortLabel={lesson.shortLabel}
                                            status={lessonState.status}
                                            isCurrent={lessonState.isCurrent}
                                            starsEarned={lessonState.starsEarned}
                                            xpReward={lesson.xpReward}
                                            onClick={handleLessonClick}
                                        />
                                    );
                                })}
                            </LessonGrid>
                        </ModuleSection>
                    </div>
                ))}
            </div>

            <CourseNavigator modules={navigatorModules} />
        </div>
    );
};