import React, { useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import styles from './CulturalMasteryCard.module.css';

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

export interface CulturalMasteryCardProps {
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

export const CulturalMasteryCard: React.FC<CulturalMasteryCardProps> = ({
  data,
  className,
}) => {
  const [viewMode, setViewMode] = useState<'mastery' | 'recall'>('mastery');
  const [activeCountry, setActiveCountry] = useState<string | null>(null);

  // --- Scales ---
  const masteryColorScale = useMemo(() => {
    return scaleLinear<string>().domain([1, 100]).range(['#dcfce7', '#15803d']); // Light Green -> Deep Green
  }, []);

  const recallColorScale = useMemo(() => {
    return scaleLinear<string>().domain([1, 10]).range(['#dbeafe', '#1d4ed8']); // Light Blue -> Deep Blue
  }, []);

  // --- Mapping Data for quick lookup ---
  const dataMap = useMemo(() => {
    const map = new Map<string, MasteryData>();
    data.forEach((d) => map.set(d.countryCode.toUpperCase(), d));
    return map;
  }, [data]);

  const activeData = activeCountry ? dataMap.get(activeCountry) : null;

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.topSection}>
        {/* LEFT: Text block */}
        <div className={styles.leftText}>
          <div>
            <h3 className={styles.title}>Cultural Mastery</h3>
            <p className={styles.subtitle}>
              This color-coded map shows your overall cultural mastery and recall capability per country. 
              The darker the blue, the faster your recall. In mastery view, deeper green indicates perfect accuracy. 
              Light gray regions have not been practiced yet.
            </p>
          </div>

          <div className={styles.toggleGroup}>
            <button 
              className={`${styles.toggleButton} ${viewMode === 'mastery' ? styles.toggleButtonActive : ''}`}
              onClick={() => setViewMode('mastery')}
            >
              Mastery
            </button>
            <button 
              className={`${styles.toggleButton} ${viewMode === 'recall' ? styles.toggleButtonActive : ''}`}
              onClick={() => setViewMode('recall')}
            >
              Recall
            </button>
          </div>

          <div className={styles.breakdownContainer}>
            <AnimatePresence mode="wait">
              {activeCountry && activeData && (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                  exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className={styles.breakdownTitle}>
                    Regional Breakdown: {getCountryName(activeCountry)}
                  </h4>
                  
                  <div className={styles.breakdownRow}>
                    <span className={styles.breakdownLabel}>Landmarks</span>
                    <div className={styles.breakdownTrack}>
                      <motion.div 
                        className={`${styles.breakdownFill} ${viewMode === 'mastery' ? styles.fillMastery : styles.fillRecall}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(2, activeData.breakdown.landmarks)}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <div className={styles.breakdownRow}>
                    <span className={styles.breakdownLabel}>Traditions</span>
                    <div className={styles.breakdownTrack}>
                      <motion.div 
                        className={`${styles.breakdownFill} ${viewMode === 'mastery' ? styles.fillMastery : styles.fillRecall}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(2, activeData.breakdown.traditions)}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <div className={styles.breakdownRow}>
                    <span className={styles.breakdownLabel}>Language</span>
                    <div className={styles.breakdownTrack}>
                      <motion.div 
                        className={`${styles.breakdownFill} ${viewMode === 'mastery' ? styles.fillMastery : styles.fillRecall}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(2, activeData.breakdown.language)}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
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
                  className={styles.noDataText}
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
                  className={styles.emptyText}
                >
                  Click any country to view its breakdown.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: Map container */}
        <div className={styles.rightMap}>
          <div className={styles.mapContainer}>
            <ComposableMap
              projectionConfig={{ scale: 140 }}
              width={800}
              height={400}
              style={{ width: '100%', height: 'auto', maxHeight: '420px' }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const iso2 = (geo.properties.ISO_A2 || geo.properties.iso_a2 || '').toUpperCase();
                    const countryData = dataMap.get(iso2);
                    const isActive = activeCountry === iso2;

                    let fill = '#e2e8f0'; // Default slate-200
                    
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

      {/* Bottom Section: Tips */}
      <div className={styles.bottomTips}>
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
