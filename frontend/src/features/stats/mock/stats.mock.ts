/* ==========================================================================
   Stats Feature — Mock Data
   Realistic values for UI development; replace with API later.
   ========================================================================== */

import type {
  StatsResponse,
  XpLevel,
  SpeedBreakdown,
  AccuracyCoverage,
  PracticeTimeBreakdown,
  AttemptsHeatmap,
  ProgressPoint,
  ProgressSeries,
  TimeRangeShort,
  TimeRangeLong,
} from '../types';

/* --------------------------------------------------------------------------
   XP / Level (dashboard-style)
   -------------------------------------------------------------------------- */

const MOCK_XP_LEVEL: XpLevel = {
  level: 12,
  xpCurrent: 4820,
  xpGoal: 6000,
};

/* --------------------------------------------------------------------------
   Helpers: random-ish but deterministic activity patterns
   -------------------------------------------------------------------------- */

const TODAY_CELLS = 20 * 5;
const WEEK_CELLS = 20 * 10;

function fillTodayCells(): number[] {
  return new Array<number>(TODAY_CELLS).fill(0);
}

function fillWeekCells(): number[] {
  return new Array<number>(WEEK_CELLS).fill(0);
}

function makeProgressPoints(
  count: number,
  labelFn: (i: number) => string,
): ProgressPoint[] {
  const points: ProgressPoint[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const seed = i * 31 + 17;
    points.push({
      label: labelFn(i),
      practiceSeconds: 200 + (seed % 1100),
      accuracyPct: 88 + (seed % 11),
      coveragePct: 72 + (seed % 18),
      speedWpm: 36 + (seed % 22),
    });
  }
  return points;
}

/* --------------------------------------------------------------------------
   Speed (WPM)
   -------------------------------------------------------------------------- */

const MOCK_SPEED: SpeedBreakdown = {
  overall: 42,
  symbols: 28,
  lowercase: 52,
};

/* --------------------------------------------------------------------------
   Accuracy & coverage
   -------------------------------------------------------------------------- */

const MOCK_ACCURACY_COVERAGE: AccuracyCoverage = {
  accuracyPct: 94,
  coveragePct: 78,
};

/* --------------------------------------------------------------------------
   Practice time by range
   -------------------------------------------------------------------------- */

const MOCK_PRACTICE_TODAY: PracticeTimeBreakdown = {
  learningSeconds: 120,
  typingSeconds: 840,
  notPassedSeconds: 180,
  totalSeconds: 1140,
};

const MOCK_PRACTICE_WEEK: PracticeTimeBreakdown = {
  learningSeconds: 900,
  typingSeconds: 5820,
  notPassedSeconds: 720,
  totalSeconds: 7440,
};

const MOCK_PRACTICE_OVERALL: PracticeTimeBreakdown = {
  learningSeconds: 14400,
  typingSeconds: 89200,
  notPassedSeconds: 10800,
  totalSeconds: 114400,
};

const MOCK_PRACTICE_TIME: Record<TimeRangeShort, PracticeTimeBreakdown> = {
  today: MOCK_PRACTICE_TODAY,
  week: MOCK_PRACTICE_WEEK,
  overall: MOCK_PRACTICE_OVERALL,
};

/* --------------------------------------------------------------------------
   Attempts heatmap
   -------------------------------------------------------------------------- */

const MOCK_ATTEMPTS: AttemptsHeatmap = {
  today: fillTodayCells(),
  week: fillWeekCells(),
};

/* --------------------------------------------------------------------------
   Progress series (daily ~30, weekly ~20, monthly ~12)
   -------------------------------------------------------------------------- */

const now = new Date();

function dailyLabel(i: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() - i);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function weeklyLabel(i: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() - i * 7);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function monthlyLabel(i: number): string {
  const d = new Date(now);
  d.setMonth(d.getMonth() - i);
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

const MOCK_PROGRESS_DAILY: ProgressSeries = {
  range: 'daily',
  points: makeProgressPoints(30, (i) => dailyLabel(i)),
};

const MOCK_PROGRESS_WEEKLY: ProgressSeries = {
  range: 'weekly',
  points: makeProgressPoints(20, (i) => weeklyLabel(i)),
};

const MOCK_PROGRESS_MONTHLY: ProgressSeries = {
  range: 'monthly',
  points: makeProgressPoints(12, (i) => monthlyLabel(i)),
};

const MOCK_PROGRESS: Record<TimeRangeLong, ProgressSeries> = {
  daily: MOCK_PROGRESS_DAILY,
  weekly: MOCK_PROGRESS_WEEKLY,
  monthly: MOCK_PROGRESS_MONTHLY,
};

/* --------------------------------------------------------------------------
   Full stats response
   -------------------------------------------------------------------------- */

export function getMockStats(): StatsResponse {
  return {
    xpLevel: MOCK_XP_LEVEL,
    speed: MOCK_SPEED,
    accuracyCoverage: MOCK_ACCURACY_COVERAGE,
    practiceTime: MOCK_PRACTICE_TIME,
    attempts: MOCK_ATTEMPTS,
    progress: MOCK_PROGRESS,
  };
}
