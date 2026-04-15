import React, { useMemo, useState } from 'react';
import { WorldMap } from '../WorldMap/WorldMap';

export interface GlobalMasteryData {
  countryCode: string; // ISO Alpha-2 code
  score: number; // 0 to 100
  name?: string; // Optional country name for the tooltip
}

export interface GlobalMasteryMapProps {
  data: GlobalMasteryData[];
  onCountryClick?: (iso2: string) => void;
  className?: string;
  height?: number;
}

const COLOR_ZERO = '#d1d5db'; // Light Gray (Tailwind gray-300)
const COLOR_FULL = '#0d9488'; // Primary Teal (Tailwind teal-600)

/**
 * Interpolates between two hex colors based on a factor (0.0 to 1.0)
 */
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

export const GlobalMasteryMap: React.FC<GlobalMasteryMapProps> = ({ 
  data, 
  onCountryClick,
  className = '',
  height = 400
}) => {
  const [hoveredIso, setHoveredIso] = useState<string | null>(null);

  const heatmapColors = useMemo(() => {
    const colors: Record<string, string> = {};
    for (const item of data) {
      const factor = Math.max(0, Math.min(100, item.score)) / 100;
      // Interpolate from 0% (Light Gray) to 100% (Primary Teal)
      colors[item.countryCode.toUpperCase()] = interpolateColor(COLOR_ZERO, COLOR_FULL, factor);
    }
    return colors;
  }, [data]);

  const hoveredData = useMemo(() => {
    if (!hoveredIso) return null;
    return data.find(d => d.countryCode.toUpperCase() === hoveredIso.toUpperCase()) || null;
  }, [hoveredIso, data]);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-100 p-6 relative overflow-hidden ${className}`}>
      {/* Card Header matching statistics style */}
      <div className="mb-6 flex flex-col gap-1">
        <h3 className="text-xl font-bold text-slate-800">Global Mastery Map</h3>
        <p className="text-sm text-slate-500 font-medium">Your progress across the globe</p>
      </div>

      {/* Embedded Tooltip (optional, floats top-right of map or dynamically. Using fixed corner for clean UI) */}
      {hoveredData && (
        <div className="absolute top-6 right-6 bg-slate-900/90 text-white px-4 py-3 rounded-xl shadow-xl backdrop-blur-sm z-10 select-none animate-in fade-in zoom-in-95 duration-200">
          <p className="font-semibold text-sm mb-1">{hoveredData.name || hoveredData.countryCode.toUpperCase()}</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold tracking-tight text-teal-400">{hoveredData.score}%</span>
            <span className="text-xs text-slate-300 mb-1 uppercase tracking-wider font-semibold">Mastery</span>
          </div>
        </div>
      )}

      {/* The pre-existing SVG Map component rendering */}
      <WorldMap 
        height={height}
        heatmapColors={heatmapColors}
        onCountryHover={setHoveredIso}
        onCountryClick={onCountryClick}
        className="transition-opacity duration-300"
      />
    </div>
  );
};
