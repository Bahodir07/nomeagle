import React, { useState, useRef, useMemo } from 'react';
import type { ProgressSeries, TimeRangeLong } from '../../../stats/types';
import { Lightbulb } from 'lucide-react';
import styles from './ProgressChart.module.css';

/* ==========================================================================
   ProgressChart
   ========================================================================== */

export interface ProgressChartProps {
  progress: Record<TimeRangeLong, ProgressSeries>;
  className?: string;
}

const METRICS = {
  practiceTime: { color: '#7dd3fc', label: 'Practice Time', isLine: false, style: 'solid' },
  accuracy: { color: '#4ade80', label: 'Accuracy %', isLine: true, style: 'outline' },
  coverage: { color: '#c084fc', label: 'Coverage', isLine: true, style: 'outline' },
  speed: { color: '#fb923c', label: 'Speed (WPM)', isLine: true, style: 'solid' },
} as const;

type MetricKey = keyof typeof METRICS;

function formatSeconds(secs: number, shortFormat = false): string {
  if (secs === 0) return '0 seconds';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  
  if (shortFormat) {
     if (h > 0) return `${h}hr : ${m}min`;
     if (m > 0) return `${m}min`;
     return `${s}s`;
  }
  
  if (h > 0) return `${h}hr : ${m}min`;
  if (m > 0) return `${m} minutes, ${s} seconds`;
  return `${secs} seconds`;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
  progress,
  className,
}) => {
  const [range, setRange] = useState<TimeRangeLong>('weekly');
  const [active, setActive] = useState<Record<MetricKey, boolean>>({
    practiceTime: true,
    accuracy: true,
    coverage: true,
    speed: true,
  });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const series = progress[range];
  const points = series?.points ?? [];

  const toggleMetric = (key: MetricKey) => {
    setActive((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // --- Left panel calculations ---
  const lastPoint = points.length > 0 ? points[points.length - 1] : null;
  const totalPracticeTime = React.useMemo(() => {
    return points.reduce((acc, p) => acc + p.practiceSeconds, 0);
  }, [points]);

  // --- Chart Scaling logic ---
  // We normalize everything to a 0..1 scale vertically
  const maxPractice = Math.max(10, ...points.map((p) => p.practiceSeconds)) * 2.5; 
  const maxSpeed = Math.max(20, ...points.map((p) => p.speedWpm)) * 1.5;

  const getBoundedValue = (key: MetricKey, pt: any) => {
    switch (key) {
      case 'practiceTime': return pt.practiceSeconds / maxPractice;
      case 'accuracy': return pt.accuracyPct / 100;
      case 'coverage': return pt.coveragePct / 100;
      case 'speed': return pt.speedWpm / maxSpeed;
      default: return 0;
    }
  };

  // --- SVG Dimensions ---
  const CHART_W = 1000;
  const CHART_H = 320;
  const PADDING_BOTTOM = 30; // space for x-axis labels
  const DRAW_H = CHART_H - PADDING_BOTTOM;

  const getPtX = (i: number) => {
    let x = points.length > 1 ? (i / (points.length - 1)) * CHART_W : CHART_W / 2;
    // ensure bar is slightly padded on edges so it doesn't get clipped
    if (x < 10) x = 10;
    if (x > CHART_W - 10) x = CHART_W - 10;
    return x;
  };

  const getPtY = (key: MetricKey, pt: any) => {
    return DRAW_H - getBoundedValue(key, pt) * DRAW_H;
  };

  /* ── Tooltip positioning ── */
  const tooltipStyle = useMemo<React.CSSProperties>(() => {
    if (hoveredIdx === null || !wrapperRef.current) return {};
    const ptX = getPtX(hoveredIdx);
    // Position tooltip near the active mouse point, roughly mid-height
    return {
      left: `${(ptX / CHART_W) * 100}%`,
      top: '50%',
    };
  }, [hoveredIdx, points.length]);

  return (
    <div className={`${styles.wrapper} ${className || ''}`}>
      <div className={styles.topRightText}>
        These stats are updated every 10 minutes. A week starts on Sunday.
      </div>

      <div className={styles.card}>
        {/* --- LEFT SIDEBAR (Text, Table, Tip) --- */}
        <div className={styles.leftSidebar}>
          <h2 className={styles.headerTitle}>Progress Overview</h2>
          <p className={styles.headerDesc}>
            Use this graph to monitor speed and coverage improvement over time.
          </p>

          <div className={styles.summaryList}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Accuracy %</span>
              <span className={styles.summaryValue}>
                {lastPoint ? `${Math.round(lastPoint.accuracyPct)}%` : '0%'}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Coverage</span>
              <span className={styles.summaryValue}>
                {lastPoint ? `${Math.round(lastPoint.coveragePct)}%` : '0%'}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Speed (WPM)</span>
              <span className={styles.summaryValue}>
                {lastPoint ? `${Math.round(lastPoint.speedWpm)} wpm` : '0 wpm'}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Practice for This Time Frame</span>
              <span className={styles.summaryValue}>
                {formatSeconds(totalPracticeTime, true)}
              </span>
            </div>
          </div>

          <div className={styles.tipBox}>
            <div className={styles.tipIconContainer}>
              <Lightbulb className={styles.tipIcon} />
            </div>
            <p className={styles.tipText}>
              <b>Tip:</b> Click the box next to any of the statistics to add or remove it from the graph. Hover over the graph to see specifics for a given time frame.
            </p>
          </div>
        </div>

        {/* --- RIGHT COLUMN (Controls, Chart) --- */}
        <div className={styles.rightContent}>
          <div className={styles.controlsTop}>
            <div className={styles.rangeGroup}>
              {(['daily', 'weekly', 'monthly'] as TimeRangeLong[]).map((r) => (
                <button
                  key={r}
                  className={`${styles.rangeButton} ${range === r ? styles.rangeButtonActive : ''}`}
                  onClick={() => setRange(r)}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Legend row */}
          <div className={styles.legendArea}>
            {(Object.entries(METRICS) as [MetricKey, typeof METRICS[MetricKey]][]).map(([key, meta]) => {
              const isActive = active[key];
              const borderStyle = meta.style === 'outline';
              const colorBoxStyle = {
                backgroundColor: borderStyle && !isActive ? 'transparent' : (borderStyle ? 'transparent' : meta.color),
                border: borderStyle ? `2px solid ${meta.color}` : `1px solid ${meta.color}`,
                opacity: !isActive && !borderStyle ? 0.3 : 1,
              };

              return (
                <div
                  key={key}
                  className={`${styles.legendItem} ${!isActive ? styles.legendItemOff : ''}`}
                  onClick={() => toggleMetric(key)}
                >
                  <div className={styles.legendColor} style={colorBoxStyle} />
                  <span>{meta.label}</span>
                </div>
              );
            })}
          </div>

          {/* SVG Chart Area */}
          <div className={styles.chartContainer} ref={wrapperRef}>
            {points.length === 0 ? (
              <div className={styles.noDataText}>Not Enough Data</div>
            ) : (
              <svg
                className={styles.chartSvg}
                viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                preserveAspectRatio="none"
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Horizontal Guide Lines */}
                <line className={styles.gridLine} x1={0} y1={DRAW_H * 0.25} x2={CHART_W} y2={DRAW_H * 0.25} strokeDasharray="4 4" opacity={0.3} />
                <line className={styles.gridLine} x1={0} y1={DRAW_H * 0.50} x2={CHART_W} y2={DRAW_H * 0.50} strokeDasharray="4 4" opacity={0.3} />
                <line className={styles.gridLine} x1={0} y1={DRAW_H * 0.75} x2={CHART_W} y2={DRAW_H * 0.75} strokeDasharray="4 4" opacity={0.3} />
                <line className={styles.gridLine} x1={0} y1={DRAW_H} x2={CHART_W} y2={DRAW_H} />

                {/* X-axis labels (slanted) */}
                {points.map((p, i) => {
                  // Only show ~12 labels max to avoid overlap
                  const step = Math.ceil(points.length / 12);
                  if (i % step !== 0 && i !== points.length - 1) return null;
                  const x = getPtX(i);
                  return (
                    <text
                      key={`label-${i}`}
                      className={styles.axisText}
                      x={x + 10}
                      y={CHART_H}
                      transform={`rotate(-45 ${x + 10} ${CHART_H})`}
                      textAnchor="end"
                    >
                      {p.label}
                    </text>
                  );
                })}

                {/* Bar chart: Practice Time */}
                {active.practiceTime && points.map((p, i) => {
                  if (p.practiceSeconds === 0) return null;
                  const x = getPtX(i);
                  const y = getPtY('practiceTime', p);
                  const barW = Math.max(4, Math.min(12, CHART_W / points.length * 0.5));
                  return (
                    <rect
                      key={`bar-${i}`}
                      x={x - barW / 2}
                      y={y}
                      width={barW}
                      height={DRAW_H - y}
                      fill={METRICS.practiceTime.color}
                      opacity={0.7}
                    />
                  );
                })}

                {/* Line charts */}
                {(['accuracy', 'coverage', 'speed'] as MetricKey[]).map((key) => {
                  if (!active[key]) return null;
                  let pathObj = `M ${getPtX(0)} ${getPtY(key, points[0])}`;
                  for (let i = 1; i < points.length; i++) {
                    pathObj += ` L ${getPtX(i)} ${getPtY(key, points[i])}`;
                  }
                  return (
                    <path
                      key={key}
                      d={pathObj}
                      fill="none"
                      stroke={METRICS[key].color}
                      strokeWidth={2.5}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  );
                })}

                {/* Hover dots and crosshair */}
                {hoveredIdx !== null && (
                  <g>
                    <line
                      x1={getPtX(hoveredIdx)}
                      y1={0}
                      x2={getPtX(hoveredIdx)}
                      y2={DRAW_H}
                      stroke="#d1d5db"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                    />
                    {(['accuracy', 'coverage', 'speed'] as MetricKey[]).map((key) => {
                      if (!active[key]) return null;
                      return (
                        <circle
                          key={`dot-${key}`}
                          cx={getPtX(hoveredIdx)}
                          cy={getPtY(key, points[hoveredIdx])}
                          r={5}
                          fill={METRICS[key].color}
                          stroke="#ffffff"
                          strokeWidth={1.5}
                        />
                      );
                    })}
                  </g>
                )}

                {/* Invisible hit areas for mouse events */}
                {points.map((p, i) => {
                  const x0 = i === 0 ? 0 : (getPtX(i) + getPtX(i - 1)) / 2;
                  const x1 = i === points.length - 1 ? CHART_W : (getPtX(i) + getPtX(i + 1)) / 2;
                  return (
                    <rect
                      key={`hit-${i}`}
                      x={x0}
                      y={0}
                      width={x1 - x0}
                      height={DRAW_H}
                      fill="transparent"
                      onMouseEnter={() => setHoveredIdx(i)}
                    />
                  );
                })}
              </svg>
            )}

            {/* Tooltip HTML overlay */}
            {hoveredIdx !== null && points[hoveredIdx] && (
              <div className={styles.tooltip} style={tooltipStyle}>
                {active.practiceTime && (
                  <div className={styles.tooltipRow}>
                    <span>Practice Time: {formatSeconds(points[hoveredIdx].practiceSeconds)}</span>
                  </div>
                )}
                {active.accuracy && (
                  <div className={styles.tooltipRow}>
                    <span>Accuracy %: {Math.round(points[hoveredIdx].accuracyPct)}%</span>
                  </div>
                )}
                {active.coverage && (
                  <div className={styles.tooltipRow}>
                    <span>Coverage: {Math.round(points[hoveredIdx].coveragePct)}%</span>
                  </div>
                )}
                {active.speed && (
                  <div className={styles.tooltipRow}>
                    <span>Speed (WPM): {Math.round(points[hoveredIdx].speedWpm)} wpm</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
