import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { WorldMap } from '../WorldMap/WorldMap';
import styles from './CulturalMasteryHeatmap.module.css';

export interface MasteryData {
  score: number; // 0 to 100
  name: string;
  landmarks: number;
  language: number; // 0 to 100
}

export interface CulturalMasteryHeatmapProps {
  data: Record<string, MasteryData>;
  onCountryClick?: (iso2: string) => void;
  className?: string;
  height?: number;
}

const COLOR_ZERO = '#d1d5db'; // gray-300
const COLOR_FULL = '#2dd4bf'; // teal-400

function interpolateColor(color1: string, color2: string, factor: number) {
  const hex = (c: string) => {
    let hexCoords = c.replace('#', '');
    if (hexCoords.length === 3) hexCoords = hexCoords.split('').map(x => x + x).join('');
    return [
      parseInt(hexCoords.slice(0, 2), 16),
      parseInt(hexCoords.slice(2, 4), 16),
      parseInt(hexCoords.slice(4, 6), 16)
    ];
  };
  const c1 = hex(color1);
  const c2 = hex(color2);
  const clamp = (val: number) => Math.max(0, Math.min(255, val));
  const result = c1.map((c, i) => clamp(Math.round(c + factor * (c2[i] - c))));
  return `#${result.map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Encapsulated Tooltip component.
 * Attaches its own mouse listeners to update position, preventing the WorldMap parent from re-rendering rapidly on every mouse move.
 */
const HeatmapTooltip: React.FC<{
  iso2: string;
  data: Record<string, MasteryData>;
  containerRef: React.RefObject<HTMLDivElement>;
}> = ({ iso2, data, containerRef }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [containerRef]);

  const info = data[iso2.toLowerCase()] || data[iso2.toUpperCase()];
  if (!info) return null;

  return (
    <div 
      className={styles.tooltipWrap}
      style={{ left: pos.x + 15, top: pos.y + 15 }}
      aria-hidden="true"
    >
      <div className={styles.tooltipHeader}>
        <span className={styles.tooltipTitle}>{info.name}</span>
        <span className={styles.tooltipScore}>{info.score}/100</span>
      </div>
      <div className={styles.tooltipBody}>
        <div className={styles.tooltipRow}>
          <span className={styles.tooltipLabel}>Landmarks</span>
          <span className={styles.tooltipValue}>{info.landmarks}</span>
        </div>
        <div className={styles.tooltipRow}>
          <span className={styles.tooltipLabel}>Language</span>
          <span className={styles.tooltipValue}>{info.language}%</span>
        </div>
      </div>
    </div>
  );
};

export const CulturalMasteryHeatmap: React.FC<CulturalMasteryHeatmapProps> = ({
  data,
  onCountryClick,
  className,
  height = 520,
}) => {
  const [hoveredIso, setHoveredIso] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const heatmapColors = useMemo(() => {
    const colors: Record<string, string> = {};
    for (const [iso2, info] of Object.entries(data)) {
      const factor = Math.max(0, Math.min(100, info.score)) / 100;
      colors[iso2.toUpperCase()] = interpolateColor(COLOR_ZERO, COLOR_FULL, factor);
    }
    return colors;
  }, [data]);

  const handleCountryHover = useCallback((iso2: string | null) => {
    setHoveredIso(iso2);
  }, []);

  return (
    <div 
      className={[styles.container, className].filter(Boolean).join(' ')} 
      ref={containerRef}
      style={{ minHeight: height }}
    >
      <WorldMap 
        height={height}
        heatmapColors={heatmapColors}
        onCountryHover={handleCountryHover}
        onCountryClick={onCountryClick}
      />
      
      {hoveredIso && (
        <HeatmapTooltip 
          iso2={hoveredIso} 
          data={data} 
          containerRef={containerRef} 
        />
      )}
    </div>
  );
};
