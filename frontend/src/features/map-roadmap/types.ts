export type GameType =
  | "CultureMatchRush"
  | "FestivalTimeline"
  | "GuessTheLandmark"
  | "StreetFoodSprint";

export interface Position {
  /** X coordinate as a percentage (0-100) for responsive positioning */
  x: number;
  /** Y coordinate as a percentage (0-100) for responsive positioning */
  y: number;
}

export interface GameNode {
  /** Unique identifier for the game node */
  id: string;
  /** Title to display for the node or in tooltips */
  title: string;
  /** The type of game this node represents */
  gameType: GameType;
  /** Responsive position of the node on the map overlay */
  position: Position;
  /** Whether the node is locked and cannot be played yet */
  isLocked: boolean;
  /** Whether the node has been successfully completed by the user */
  isCompleted: boolean;
  /** Optional routing path if navigating to a specific game route */
  routePath?: string;
}

export interface CountryRoadmap {
  /** Unique country code (e.g., "kz" for Kazakhstan) */
  countryCode: string;
  /** URL or path to the background map image */
  mapImage: string;
  /** List of all game nodes available on this country's map */
  nodes: GameNode[];
}
