/* ==========================================================================
   Stats Feature — Types
   Data shapes for statistics (speed, accuracy, practice time, progress).
   ========================================================================== */

/* --------------------------------------------------------------------------
   Time ranges
   -------------------------------------------------------------------------- */

export type TimeRangeShort = 'today' | 'week' | 'overall';

export type TimeRangeLong = 'daily' | 'weekly' | 'monthly';

/* --------------------------------------------------------------------------
   Speed (WPM breakdown)
   -------------------------------------------------------------------------- */

export interface SpeedBreakdown {
  overall: number;
  symbols: number;
  lowercase: number;
}

/* --------------------------------------------------------------------------
   Accuracy & coverage
   -------------------------------------------------------------------------- */

export interface AccuracyCoverage {
  accuracyPct: number;
  coveragePct: number;
}

/* --------------------------------------------------------------------------
   Practice time breakdown (per time range)
   -------------------------------------------------------------------------- */

export interface PracticeTimeBreakdown {
  learningSeconds: number;
  typingSeconds: number;
  notPassedSeconds: number;
  totalSeconds: number;
}

/* --------------------------------------------------------------------------
   Attempts heatmap (activity cells)
   -------------------------------------------------------------------------- */

export interface AttemptsHeatmap {
  /** Today: 20 columns × 5 rows = 100 cells; each value = attempt count for that cell */
  today: number[];
  /** This week: 20 columns × 10 rows = 200 cells; each value = attempt count for that cell */
  week: number[];
}

/* --------------------------------------------------------------------------
   Progress (one data point in a series)
   -------------------------------------------------------------------------- */

export interface ProgressPoint {
  label: string;
  practiceSeconds: number;
  accuracyPct: number;
  coveragePct: number;
  speedWpm: number;
}

export interface ProgressSeries {
  range: TimeRangeLong;
  points: ProgressPoint[];
}

/* --------------------------------------------------------------------------
   Stats API response
   -------------------------------------------------------------------------- */

/* --------------------------------------------------------------------------
   XP / Level (dashboard-style progress)
   -------------------------------------------------------------------------- */

export interface XpLevel {
  level: number;
  xpCurrent: number;
  xpGoal: number;
}

export interface StatsResponse {
  xpLevel: XpLevel;
  speed: SpeedBreakdown;
  accuracyCoverage: AccuracyCoverage;
  practiceTime: Record<TimeRangeShort, PracticeTimeBreakdown>;
  attempts: AttemptsHeatmap;
  progress: Record<TimeRangeLong, ProgressSeries>;
}
