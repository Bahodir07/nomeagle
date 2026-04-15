import { CountryRoadmap } from "../types";

export const kazakhstanRoadmapMock: CountryRoadmap = {
  countryCode: "KZ",
  mapImage: "/assets/maps/kazakhstan.png",
  nodes: [
    /* ── Cycle 1 ─────────────────────────────────────── */
    {
      id: "kz-level-1",
      title: "Culture Match Rush I",
      gameType: "CultureMatchRush",
      position: { x: 24, y: 64 }, // Aktau / Caspian Sea Coast
      isLocked: false,
      isCompleted: true,
      routePath: "/app/countries/kz/game",
    },
    {
      id: "kz-level-2",
      title: "Festival Timeline I",
      gameType: "FestivalTimeline",
      position: { x: 35, y: 58 }, // Aral Sea region
      isLocked: false,
      isCompleted: true,
      routePath: "/app/countries/kz/festival",
    },
    {
      id: "kz-level-3",
      title: "Guess the Landmark I",
      gameType: "GuessTheLandmark",
      position: { x: 46, y: 70 }, // Baikonur area
      isLocked: false,
      isCompleted: false,
      routePath: "/app/countries/kz/landmarks",
    },
    {
      id: "kz-level-4",
      title: "Street Food Sprint I",
      gameType: "StreetFoodSprint",
      position: { x: 53, y: 78 }, // Shymkent area (Deep South)
      isLocked: true,
      isCompleted: false,
      routePath: "/app/countries/kz/sprint",
    },

    /* ── Cycle 2 ─────────────────────────────────────── */
    {
      id: "kz-level-5",
      title: "Culture Match Rush II",
      gameType: "CultureMatchRush",
      position: { x: 63, y: 72 }, // Almaty / Tien Shan foothills
      isLocked: true,
      isCompleted: false,
      routePath: "/app/countries/kz/game",
    },
    {
      id: "kz-level-6",
      title: "Festival Timeline II",
      gameType: "FestivalTimeline",
      position: { x: 68, y: 55 }, // Balkhash area
      isLocked: true,
      isCompleted: false,
      routePath: "/app/countries/kz/festival",
    },
    {
      id: "kz-level-7",
      title: "Guess the Landmark II",
      gameType: "GuessTheLandmark",
      position: { x: 60, y: 40 }, // Karaganda area (Center)
      isLocked: true,
      isCompleted: false,
      routePath: "/app/countries/kz/landmarks",
    },
    {
      id: "kz-level-8",
      title: "Street Food Sprint II",
      gameType: "StreetFoodSprint",
      position: { x: 55, y: 28 }, // Astana area (North)
      isLocked: true,
      isCompleted: false,
      routePath: "/app/countries/kz/sprint",
    },
  ],
};
