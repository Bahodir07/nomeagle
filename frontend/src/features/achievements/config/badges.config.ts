import type { BadgeDefinition } from "../types";

/* Images from src/assets/badges/ — only import from folders that have files (explorer, country). */
import firstStepLocked from "../../../assets/badges/explorer/first-step.locked.png";
import firstStepUnlocked from "../../../assets/badges/explorer/first-step.unlocked.png";
import culturalTravelerLocked from "../../../assets/badges/explorer/cultural-traveler.locked.png";
import culturalTravelerUnlocked from "../../../assets/badges/explorer/cultural-traveler.unlocked.png";
import kzScholarLocked from "../../../assets/badges/country/kazakhstan.locked.png";
import kzScholarUnlocked from "../../../assets/badges/country/kazakhstan.unlocked.png";

/**
 * Placeholder for badges whose folders are empty (mastery, streak). Replace with real imports when you add PNGs.
 */
const PLACEHOLDER_LOCKED = culturalTravelerLocked;
const PLACEHOLDER_UNLOCKED = culturalTravelerUnlocked;

/**
 * Data-driven badge definitions. Each badge has its own title and description (no emojis in UI).
 */
export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // --- Explorer ---
  {
    id: "first-step",
    category: "explorer",
    title: "First Step",
    description: "Your journey begins — the world is now open to you!",
    requirementText: "Finish your first country",
    unlockedImage: firstStepUnlocked,
    lockedImage: firstStepLocked,
    logic: { type: "countries_completed_at_least", value: 1 },
    order: 1,
  },
  {
    id: "cultural-traveler",
    category: "explorer",
    title: "Cultural Traveler",
    description: "You're collecting countries like a champion!",
    requirementText: "Complete 3 countries",
    unlockedImage: culturalTravelerUnlocked,
    lockedImage: culturalTravelerLocked,
    logic: { type: "countries_completed_at_least", value: 3 },
    order: 2,
  },
  {
    id: "world-explorer",
    category: "explorer",
    title: "World Explorer",
    description: "Ten countries down. You're built different.",
    requirementText: "Complete 10 countries",
    unlockedImage: culturalTravelerUnlocked,
    lockedImage: culturalTravelerLocked,
    logic: { type: "countries_completed_at_least", value: 10 },
    order: 3,
  },
  {
    id: "global-citizen",
    category: "explorer",
    title: "Global Citizen",
    description: "You're carrying the weight of the world — easily.",
    requirementText: "Complete 25 countries",
    unlockedImage: culturalTravelerUnlocked,
    lockedImage: culturalTravelerLocked,
    logic: { type: "countries_completed_at_least", value: 25 },
    order: 4,
  },
  {
    id: "master-explorer",
    category: "explorer",
    title: "Master Explorer",
    description: "You didn't travel the world. You conquered it.",
    requirementText: "Complete 50+ countries",
    unlockedImage: culturalTravelerUnlocked,
    lockedImage: culturalTravelerLocked,
    logic: { type: "countries_completed_at_least", value: 50 },
    order: 5,
  },
  // --- Streak (placeholder until you add streak/*.png) ---
  {
    id: "streak-3",
    category: "streak",
    title: "Three Day Streak",
    description: "Practice on three consecutive days.",
    requirementText: "3-day streak",
    unlockedImage: PLACEHOLDER_UNLOCKED,
    lockedImage: PLACEHOLDER_LOCKED,
    logic: { type: "streak_at_least", value: 3 },
    order: 1,
  },
  // --- Country ---
  {
    id: "kz-scholar",
    category: "country",
    title: "Kazakhstan Historian",
    description: "You carried the steppe on your shoulders.",
    requirementText: "Complete Kazakhstan",
    unlockedImage: kzScholarUnlocked,
    lockedImage: kzScholarLocked,
    logic: { type: "has_completed_country", value: "kz" },
    order: 1,
  },
  {
    id: "jp-scholar",
    category: "country",
    title: "Japan Scholar",
    description: "You've mastered the land of the rising sun.",
    requirementText: "Complete Japan",
    unlockedImage: kzScholarUnlocked,
    lockedImage: kzScholarLocked,
    logic: { type: "has_completed_country", value: "jp" },
    order: 2,
  },
  {
    id: "fr-expert",
    category: "country",
    title: "France Expert",
    description: "You know your way around French culture.",
    requirementText: "Complete France",
    unlockedImage: kzScholarUnlocked,
    lockedImage: kzScholarLocked,
    logic: { type: "has_completed_country", value: "fr" },
    order: 3,
  },
  // --- Mastery (placeholder until you add mastery/*.png) ---
  {
    id: "perfect-quiz",
    category: "mastery",
    title: "Perfect Quiz",
    description: "Score 100% on any quiz.",
    requirementText: "100% on a quiz",
    unlockedImage: PLACEHOLDER_UNLOCKED,
    lockedImage: PLACEHOLDER_LOCKED,
    logic: { type: "perfect_quiz_at_least", value: 1 },
    order: 1,
  },
];
