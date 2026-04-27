import type { BadgeDefinition } from "../types";

/* Explorer badge images */
import firstStepLocked from "../../../assets/badges/explorer/first-step.locked.png";
import firstStepUnlocked from "../../../assets/badges/explorer/first-step.unlocked.png";
import culturalTravelerLocked from "../../../assets/badges/explorer/cultural-traveler.locked.png";
import culturalTravelerUnlocked from "../../../assets/badges/explorer/cultural-traveler.unlocked.png";

/* Country achievement photos (same image used for locked/unlocked — CSS grayscale handles locked state) */
import italianImg from "../../../assets/badges/country/italian.jpeg";
import chineseImg from "../../../assets/badges/country/chinese.jpeg";
import germanImg from "../../../assets/badges/country/german.jpeg";
import japaneseImg from "../../../assets/badges/country/japanese.jpeg";
import frenchImg from "../../../assets/badges/country/french.jpeg";
import brazilianImg from "../../../assets/badges/country/brazilian.jpeg";
import canadianImg from "../../../assets/badges/country/canadian.jpeg";
import australianImg from "../../../assets/badges/country/australian.jpeg";
import indianImg from "../../../assets/badges/country/indian.jpeg";
import mexicanImg from "../../../assets/badges/country/mexican.jpeg";
import kazakhImg from "../../../assets/badges/country/kazakh.jpeg";
import turkishImg from "../../../assets/badges/country/turkish.jpeg";
import spanishImg from "../../../assets/badges/country/spanish.jpeg";
import egyptianImg from "../../../assets/badges/country/egyptian.jpeg";
import thaiImg from "../../../assets/badges/country/thai.jpeg";

const PLACEHOLDER_LOCKED = culturalTravelerLocked;
const PLACEHOLDER_UNLOCKED = culturalTravelerUnlocked;

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
  // --- Streak (placeholder until streak/*.png assets are added) ---
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
    id: "it-expert",
    category: "country",
    title: "Italy Connoisseur",
    description: "You've savored every corner of Italian culture.",
    requirementText: "Complete Italy",
    unlockedImage: italianImg,
    lockedImage: italianImg,
    logic: { type: "has_completed_country", value: "it" },
    order: 1,
  },
  {
    id: "cn-scholar",
    category: "country",
    title: "China Scholar",
    description: "Ancient wisdom and modern wonder — you know it all.",
    requirementText: "Complete China",
    unlockedImage: chineseImg,
    lockedImage: chineseImg,
    logic: { type: "has_completed_country", value: "cn" },
    order: 2,
  },
  {
    id: "de-expert",
    category: "country",
    title: "Germany Expert",
    description: "Precision, history, and culture — mastered.",
    requirementText: "Complete Germany",
    unlockedImage: germanImg,
    lockedImage: germanImg,
    logic: { type: "has_completed_country", value: "de" },
    order: 3,
  },
  {
    id: "jp-scholar",
    category: "country",
    title: "Japan Scholar",
    description: "You've mastered the land of the rising sun.",
    requirementText: "Complete Japan",
    unlockedImage: japaneseImg,
    lockedImage: japaneseImg,
    logic: { type: "has_completed_country", value: "jp" },
    order: 4,
  },
  {
    id: "fr-expert",
    category: "country",
    title: "France Expert",
    description: "You know your way around French culture.",
    requirementText: "Complete France",
    unlockedImage: frenchImg,
    lockedImage: frenchImg,
    logic: { type: "has_completed_country", value: "fr" },
    order: 5,
  },
  {
    id: "br-expert",
    category: "country",
    title: "Brazil Explorer",
    description: "Carnival spirit and rainforest secrets — all yours.",
    requirementText: "Complete Brazil",
    unlockedImage: brazilianImg,
    lockedImage: brazilianImg,
    logic: { type: "has_completed_country", value: "br" },
    order: 6,
  },
  {
    id: "ca-scholar",
    category: "country",
    title: "Canada Connoisseur",
    description: "From the Rockies to the Maritimes — fully explored.",
    requirementText: "Complete Canada",
    unlockedImage: canadianImg,
    lockedImage: canadianImg,
    logic: { type: "has_completed_country", value: "ca" },
    order: 7,
  },
  {
    id: "au-expert",
    category: "country",
    title: "Australia Expert",
    description: "The outback, the reef, the culture — all conquered.",
    requirementText: "Complete Australia",
    unlockedImage: australianImg,
    lockedImage: australianImg,
    logic: { type: "has_completed_country", value: "au" },
    order: 8,
  },
  {
    id: "in-scholar",
    category: "country",
    title: "India Scholar",
    description: "A billion stories, and you've absorbed them all.",
    requirementText: "Complete India",
    unlockedImage: indianImg,
    lockedImage: indianImg,
    logic: { type: "has_completed_country", value: "in" },
    order: 9,
  },
  {
    id: "mx-expert",
    category: "country",
    title: "Mexico Expert",
    description: "Rich history and vibrant culture — fully explored.",
    requirementText: "Complete Mexico",
    unlockedImage: mexicanImg,
    lockedImage: mexicanImg,
    logic: { type: "has_completed_country", value: "mx" },
    order: 10,
  },
  {
    id: "kz-scholar",
    category: "country",
    title: "Kazakhstan Historian",
    description: "You carried the steppe on your shoulders.",
    requirementText: "Complete Kazakhstan",
    unlockedImage: kazakhImg,
    lockedImage: kazakhImg,
    logic: { type: "has_completed_country", value: "kz" },
    order: 11,
  },
  {
    id: "tr-scholar",
    category: "country",
    title: "Turkey Connoisseur",
    description: "East meets West, and you know both sides.",
    requirementText: "Complete Turkey",
    unlockedImage: turkishImg,
    lockedImage: turkishImg,
    logic: { type: "has_completed_country", value: "tr" },
    order: 12,
  },
  {
    id: "es-expert",
    category: "country",
    title: "Spain Expert",
    description: "Flamenco, history, and sunshine — mastered.",
    requirementText: "Complete Spain",
    unlockedImage: spanishImg,
    lockedImage: spanishImg,
    logic: { type: "has_completed_country", value: "es" },
    order: 13,
  },
  {
    id: "eg-scholar",
    category: "country",
    title: "Egypt Scholar",
    description: "Pyramids, pharaohs, and history — all revealed.",
    requirementText: "Complete Egypt",
    unlockedImage: egyptianImg,
    lockedImage: egyptianImg,
    logic: { type: "has_completed_country", value: "eg" },
    order: 14,
  },
  {
    id: "th-expert",
    category: "country",
    title: "Thailand Expert",
    description: "Temples, traditions, and taste — all discovered.",
    requirementText: "Complete Thailand",
    unlockedImage: thaiImg,
    lockedImage: thaiImg,
    logic: { type: "has_completed_country", value: "th" },
    order: 15,
  },
  // --- Mastery (placeholder until mastery/*.png assets are added) ---
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
