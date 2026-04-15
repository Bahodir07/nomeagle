import type { VideoLesson } from '../types';
import { mockJapanGreetingVideo } from '../mock/japanGreetingVideo.mock';

const MOCK_LESSONS: Record<string, VideoLesson> = {
    [mockJapanGreetingVideo.lessonId]: mockJapanGreetingVideo,
};

/**
 * Fetch a video lesson by its ID.
 *
 * TODO: Replace mock lookup with a real API call once the backend is ready:
 *   const res = await fetch(`/api/lessons/video/${lessonId}`);
 *   if (!res.ok) throw new Error(`Video lesson not found: ${lessonId}`);
 *   return (await res.json()) as VideoLesson;
 */
export async function getVideoLessonById(lessonId: string): Promise<VideoLesson> {
    const lesson = MOCK_LESSONS[lessonId];

    if (!lesson) {
        throw new Error(`Video lesson not found: ${lessonId}`);
    }

    return Promise.resolve(lesson);
}
