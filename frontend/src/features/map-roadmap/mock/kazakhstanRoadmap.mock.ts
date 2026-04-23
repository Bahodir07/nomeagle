import { CountryRoadmap } from "../types";

export const kazakhstanRoadmapMock: CountryRoadmap = {
  countryCode: "KZ",
  mapImage: "/assets/maps/kazakhstan.png",
  nodes: [
    /* ── Cycle 1 ─────────────────────────────────────── */
    {
      id: "kz-level-1",
      title: "Kazakh Culture Introduction",
      lessonType: "article",
      lessonId: "kz-lesson-1",
      position: { x: 24, y: 64 },
      isLocked: false,
      isCompleted: true,
    },
    {
      id: "kz-level-2",
      title: "Traditional Festivals",
      lessonType: "video",
      lessonId: "kz-lesson-2",
      position: { x: 35, y: 58 },
      isLocked: false,
      isCompleted: true,
    },
    {
      id: "kz-level-3",
      title: "Landmarks & Architecture",
      lessonType: "article",
      lessonId: "kz-lesson-3",
      position: { x: 46, y: 70 },
      isLocked: false,
      isCompleted: false,
    },
    {
      id: "kz-level-4",
      title: "Cuisine & Street Food",
      lessonType: "summary",
      lessonId: "kz-lesson-4",
      position: { x: 53, y: 78 },
      isLocked: true,
      isCompleted: false,
    },

    /* ── Cycle 2 ─────────────────────────────────────── */
    {
      id: "kz-level-5",
      title: "History & Nomadic Heritage",
      lessonType: "video",
      lessonId: "kz-lesson-5",
      position: { x: 63, y: 72 },
      isLocked: true,
      isCompleted: false,
    },
    {
      id: "kz-level-6",
      title: "Language & Traditions",
      lessonType: "article",
      lessonId: "kz-lesson-6",
      position: { x: 68, y: 55 },
      isLocked: true,
      isCompleted: false,
    },
    {
      id: "kz-level-7",
      title: "Nature & Geography",
      lessonType: "video",
      lessonId: "kz-lesson-7",
      position: { x: 60, y: 40 },
      isLocked: true,
      isCompleted: false,
    },
    {
      id: "kz-level-8",
      title: "Modern Kazakhstan",
      lessonType: "summary",
      lessonId: "kz-lesson-8",
      position: { x: 55, y: 28 },
      isLocked: true,
      isCompleted: false,
    },
  ],
};
