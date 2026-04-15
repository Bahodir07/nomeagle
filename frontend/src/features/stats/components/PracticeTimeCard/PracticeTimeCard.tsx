import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '../../../../components/ui';
import { SegmentedControl } from '../../../../components/ui';
import type { PracticeTimeBreakdown, TimeRangeShort } from '../../types';
import styles from './PracticeTimeCard.module.css';

/* --------------------------------------------------------------------------
   Format seconds as HH:MM:SS
   -------------------------------------------------------------------------- */

function formatHms(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}

/* --------------------------------------------------------------------------
   Donut chart (SVG, 3 segments: typing, learning, not passed)
   -------------------------------------------------------------------------- */

const DONUT_SIZE = 160;
const DONUT_STROKE = 28;
const DONUT_R = (DONUT_SIZE - DONUT_STROKE) / 2;
const DONUT_OUTER_R = DONUT_R + DONUT_STROKE / 2;
const DONUT_CX = DONUT_SIZE / 2;
const DONUT_CY = DONUT_SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * DONUT_R;

/* Legend: label, seconds key, color (stroke + text), segment index for line angle */
const LEGEND_ITEMS = [
  { key: 'typing', label: 'Practice', color: '#0d9488', className: styles.segmentTyping },
  { key: 'learning', label: 'Learning', color: '#38bdf8', className: styles.segmentLearning },
  { key: 'notPassed', label: 'Not Passed', color: '#f472b6', className: styles.segmentNotPassed },
] as const;

/* Wrapper size for donut + leader lines and labels */
const CHART_WIDTH = 340;
const CHART_HEIGHT = 260;
const DONUT_OX = 90;
const DONUT_OY = 50;
const CENTER_X = DONUT_OX + DONUT_CX;
const CENTER_Y = DONUT_OY + DONUT_CY;

function DonutChart({ data }: { data: PracticeTimeBreakdown }) {
  const { typingSeconds, learningSeconds, notPassedSeconds, totalSeconds } = data;
  const total = totalSeconds || 1;

  const segments = useMemo(() => {
    const lenT = (typingSeconds / total) * CIRCUMFERENCE;
    const lenL = (learningSeconds / total) * CIRCUMFERENCE;
    const lenN = (notPassedSeconds / total) * CIRCUMFERENCE;
    return [
      { len: lenT, offset: 0, className: styles.segmentTyping },
      { len: lenL, offset: -lenT, className: styles.segmentLearning },
      { len: lenN, offset: -(lenT + lenL), className: styles.segmentNotPassed },
    ];
  }, [typingSeconds, learningSeconds, notPassedSeconds, totalSeconds]);

  const outerR = DONUT_OUTER_R;

  /* Segment outer points (midpoint on ring) and label position = segment + outward offset */
  const segmentLabels = useMemo(() => {
    const lenT = (typingSeconds / total) * CIRCUMFERENCE;
    const lenL = (learningSeconds / total) * CIRCUMFERENCE;
    const lenN = (notPassedSeconds / total) * CIRCUMFERENCE;
    const r = DONUT_R;
    const toAngle = (s: number) => -Math.PI / 2 + s / r;
    const toOuterPoint = (angle: number) => ({
      x: CENTER_X + outerR * Math.cos(angle),
      y: CENTER_Y + outerR * Math.sin(angle),
    });
    const midpoints = [
      toOuterPoint(toAngle(lenT / 2)),
      toOuterPoint(toAngle(lenT + lenL / 2)),
      toOuterPoint(toAngle(lenT + lenL + lenN / 2)),
    ];
    return midpoints.map((pt) => {
      const ux = (pt.x - CENTER_X) / outerR;
      const uy = (pt.y - CENTER_Y) / outerR;
      const isRight = ux >= 0;

      const elbowOffset = 20;
      const textWidth = 45;

      const elbow = {
        x: pt.x + elbowOffset * ux,
        y: pt.y + elbowOffset * uy,
      };

      const end = {
        x: elbow.x + (isRight ? textWidth : -textWidth),
        y: elbow.y,
      };

      return {
        ring: pt,
        elbow,
        end,
        isRight,
      };
    });
  }, [typingSeconds, learningSeconds, notPassedSeconds, total]);

  const secondsByKey = useMemo(
    () => ({
      typing: typingSeconds,
      learning: learningSeconds,
      notPassed: notPassedSeconds,
    }),
    [typingSeconds, learningSeconds, notPassedSeconds]
  );

  return (
    <div className={styles.donutChartWrap}>
      <svg
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className={styles.donutChartSvg}
        aria-hidden
      >
        <g transform={`translate(${DONUT_OX}, ${DONUT_OY}) rotate(-90 ${DONUT_CX} ${DONUT_CY})`}>
          {segments.map((seg, i) => (
            <circle
              key={i}
              className={seg.className}
              cx={DONUT_CX}
              cy={DONUT_CY}
              r={DONUT_R}
              fill="none"
              strokeWidth={DONUT_STROKE}
              strokeDasharray={`${seg.len} ${CIRCUMFERENCE}`}
              strokeDashoffset={seg.offset}
            />
          ))}
        </g>
        {segmentLabels.map(({ ring, elbow, end, isRight }, i) => {
          const item = LEGEND_ITEMS[i];
          const seconds = secondsByKey[item.key];
          const points = `${ring.x},${ring.y} ${elbow.x},${elbow.y} ${end.x},${end.y}`;
          const textAnchor = isRight ? 'end' : 'start';
          const textX = isRight ? end.x - 6 : end.x + 6;

          return (
            <g key={item.key}>
              <polyline
                points={points}
                fill="none"
                stroke={item.color}
                strokeWidth="1.5"
                className={styles.leaderLine}
              />
              <circle
                cx={end.x}
                cy={end.y}
                r={2.5}
                fill={item.color}
              />
              <text
                x={textX}
                y={end.y - 6}
                className={styles.legendLabelText}
                textAnchor={textAnchor}
              >
                {item.label}
              </text>
              <text
                x={textX}
                y={end.y + 12}
                className={styles.legendTimeText}
                fill={item.color}
                textAnchor={textAnchor}
              >
                {formatHms(seconds)}
              </text>
            </g>
          );
        })}
      </svg>
      <div
        className={styles.donutCenter}
        style={{
          left: DONUT_OX,
          top: DONUT_OY,
          width: DONUT_SIZE,
          height: DONUT_SIZE,
        }}
      >
        <span className={styles.donutTime}>{formatHms(totalSeconds)}</span>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   PracticeTimeCard props
   -------------------------------------------------------------------------- */

export interface PracticeTimeCardProps {
  practiceTime: Record<TimeRangeShort, PracticeTimeBreakdown>;
  className?: string;
}

const TIME_RANGE_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'overall', label: 'Overall' },
] as const;

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */

export const PracticeTimeCard: React.FC<PracticeTimeCardProps> = ({
  practiceTime,
  className,
}) => {
  const [range, setRange] = useState<TimeRangeShort>('overall');
  const data = practiceTime[range];

  return (
    <Card className={[styles.card, className].filter(Boolean).join(' ')}>
      <CardHeader className={styles.header}>
        <h3 className={styles.title}>Practice Time</h3>
        <div className={styles.infoWrap}>
          <button
            type="button"
            className={styles.infoBtn}
            aria-label="Information about practice time"
            aria-describedby="practice-time-tooltip"
          >
            <span className={styles.infoIcon}>i</span>
          </button>
          <div
            id="practice-time-tooltip"
            className={styles.tooltip}
            role="tooltip"
          >
            <p className={styles.tooltipLine}>
              <strong>Practice:</strong> Time spent on practice activities and lessons that were passed.
            </p>
            <p className={styles.tooltipLine}>
              <strong>Learning:</strong> Time spent exploring cultures, traditions, and key concepts around the world.
            </p>
            <p className={styles.tooltipLine}>
              <strong>Incomplete:</strong> Time spent on activities and lessons not yet completed.
            </p>
            <p className={styles.tooltipLine}>
              <strong>Not Passed:</strong> Time spent on activities and lessons that were not passed.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className={styles.content}>
        <div className={styles.donutSection}>
          <DonutChart data={data} />
        </div>
        <SegmentedControl
          value={range}
          options={TIME_RANGE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          onChange={(v) => setRange(v as TimeRangeShort)}
          size="sm"
          aria-label="Time range"
          className={styles.toggle}
        />
      </CardContent>
    </Card>
  );
};
