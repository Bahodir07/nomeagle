import React, { useMemo, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { Card } from '../../../../components/ui';
import styles from './GlobalMasteryMap.module.css';

const geoUrl = 'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/v1/topojson-maps/world-110m.json';

export interface MasteryData {
  countryCode: string; // ISO Alpha-2
  score: number;       // 0 - 100
  recallScore: number; // 0 - 10
  breakdown: {
    landmarks: number; // 0 - 100
    traditions: number; // 0 - 100
    language: number; // 0 - 100
  };
}

export interface GlobalMasteryMapProps {
  data: MasteryData[];
  className?: string;
}

const getCountryName = (code: string) => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code;
  } catch {
    return code;
  }
};

export const GlobalMasteryMap: React.FC<GlobalMasteryMapProps> = ({
  data,
  className,
}) => {
  const [viewMode, setViewMode] = useState<'mastery' | 'recall'>('mastery');
  const [activeCountry, setActiveCountry] = useState<string | null>(null);

  // --- Scales ---
  const masteryColorScale = useMemo(() => {
    return scaleLinear<string>().domain([1, 100]).range(['#dcfce7', '#15803d']);
  }, []);

  const recallColorScale = useMemo(() => {
    return scaleLinear<string>().domain([1, 10]).range(['#dbeafe', '#1d4ed8']);
  }, []);

  // --- Data lookup ---
  const dataMap = useMemo(() => {
    const map = new Map<string, MasteryData>();
    data.forEach((d) => map.set(d.countryCode.toUpperCase(), d));
    return map;
  }, [data]);

  const activeData = activeCountry ? dataMap.get(activeCountry) : null;

  return (
    <div className={`${styles.root} ${className || ''}`}>
      {/* ── Main Card ── */}
      <Card className={styles.card}>
        <div className={styles.panelLayout}>

          {/* ── Left Column: Text & Controls ── */}
          <div className={styles.leftColumn}>
            <h3 className={styles.heading}>Cultural Mastery</h3>

            <p className={styles.description}>
              This color-coded map shows your overall cultural mastery and recall capability per country.
              The darker the blue, the faster your recall. In mastery view, deeper green indicates perfect accuracy.
              Light gray regions have not been practiced yet.
            </p>

            {/* Toggles */}
            <div className={styles.toggleButtonGroup}>
              <button
                className={`${styles.toggleButton} ${viewMode === 'mastery' ? styles.active : ''}`}
                onClick={() => setViewMode('mastery')}
              >
                Mastery
              </button>
              <button
                className={`${styles.toggleButton} ${viewMode === 'recall' ? styles.active : ''}`}
                onClick={() => setViewMode('recall')}
              >
                Recall
              </button>
            </div>

            {/* Drill-down breakdown */}
            <div className={styles.breakdownPanel}>
              <AnimatePresence mode="wait">
                {activeCountry && activeData && (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.3 }}
                    className={styles.breakdownInner}
                  >
                    <h4 className={styles.breakdownTitle}>
                      Regional Breakdown: {getCountryName(activeCountry)}
                    </h4>
                    <div className={styles.breakdownRows}>
                      {/* Landmarks */}
                      <div className={styles.breakdownRow}>
                        <span className={styles.breakdownLabel}>Landmarks</span>
                        <div className={styles.breakdownTrack}>
                          <motion.div
                            className={viewMode === 'mastery' ? styles.barMastery : styles.barRecall}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(2, activeData.breakdown.landmarks)}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                      {/* Traditions */}
                      <div className={styles.breakdownRow}>
                        <span className={styles.breakdownLabel}>Traditions</span>
                        <div className={styles.breakdownTrack}>
                          <motion.div
                            className={viewMode === 'mastery' ? styles.barMastery : styles.barRecall}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(2, activeData.breakdown.traditions)}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                      {/* Language */}
                      <div className={styles.breakdownRow}>
                        <span className={styles.breakdownLabel}>Language</span>
                        <div className={styles.breakdownTrack}>
                          <motion.div
                            className={viewMode === 'mastery' ? styles.barMastery : styles.barRecall}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(2, activeData.breakdown.language)}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                {activeCountry && !activeData && (
                  <motion.div
                    key="nodata"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={styles.noDataState}
                  >
                    No historical practice data for {activeCountry}. Start learning!
                  </motion.div>
                )}
                {!activeCountry && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={styles.emptyState}
                  >
                    Click any country to view its breakdown.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right Column: Map ── */}
          <div className={styles.mapColumn}>
            <div className={styles.mapWrapper}>
              <ComposableMap
                projectionConfig={{ scale: 140 }}
                width={800}
                height={400}
                className={styles.map}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const iso2 = (geo.properties.ISO_A2 || geo.properties.iso_a2 || '').toUpperCase();
                      const countryData = dataMap.get(iso2);
                      const isActive = activeCountry === iso2;

                      let fill = '#e2e8f0';

                      if (countryData) {
                        if (viewMode === 'mastery' && countryData.score > 0) {
                          fill = masteryColorScale(countryData.score) as string;
                        } else if (viewMode === 'recall' && countryData.recallScore > 0) {
                          fill = recallColorScale(countryData.recallScore) as string;
                        }
                      }

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={fill}
                          stroke={isActive ? '#f97316' : '#ffffff'}
                          strokeWidth={isActive ? 1.5 : 0.6}
                          onClick={() => setActiveCountry(isActive ? null : iso2)}
                          style={{
                            default: { outline: 'none' },
                            hover: { fill: isActive ? fill : '#cbd5e1', outline: 'none', cursor: 'pointer' },
                            pressed: { outline: 'none' },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Tip Cards ── */}
      <div className={styles.tipsRow}>
        <div className={styles.tipCard}>
          <Lightbulb className={styles.tipIcon} />
          <p className={styles.tipText}>
            <b>Tip:</b> Deeper green indicates perfect accuracy in this region's landmarks and culture.
          </p>
        </div>
        <div className={styles.tipCard}>
          <Lightbulb className={styles.tipIcon} />
          <p className={styles.tipText}>
            <b>Tip:</b> Darker blue means your recall speed is faster (under 2 seconds).
          </p>
        </div>
        <div className={styles.tipCard}>
          <Lightbulb className={styles.tipIcon} />
          <p className={styles.tipText}>
            <b>Tip:</b> Click any colored country on the map to see exactly what you need to practice.
          </p>
        </div>
      </div>
    </div>
  );
};
