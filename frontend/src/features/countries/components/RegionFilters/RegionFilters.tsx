import React, { useCallback } from 'react';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Checkbox } from '../../../../components/ui/Checkbox';
import styles from './RegionFilters.module.css';

/* ==========================================================================
   RegionFilters
   Filter panel: "Filters" title, REGION + ETHNIC / LANGUAGE GROUP sections.
   Ethnic groups: communities linked by shared ancestry, culture, language,
   and historical identity (e.g. Turkic, Slavic, Germanic, Chinese (Han)).
   If no selection in a section => show all (consumer handles empty selected).
   ========================================================================== */

/** Canonical region list for the filter */
export const REGION_OPTIONS = [
  'Asia',
  'Europe',
  'Africa',
  'North America',
  'South America',
  'Oceania',
] as const;

export type RegionOption = (typeof REGION_OPTIONS)[number];

/** Ethnic or ethnolinguistic groups — shared ancestry, culture, language, identity */
export const ETHNIC_GROUP_OPTIONS = [
  'Turkic',
  'Slavic',
  'Germanic',
  'Chinese (Han)',
  'Romance',
  'Arabic',
  'East Asian',
  'Indic',
] as const;

export type EthnicGroupOption = (typeof ETHNIC_GROUP_OPTIONS)[number];

/* ---------- Props ---------- */

export interface RegionFiltersProps {
  /** Currently selected region values */
  selected: string[];
  /** Called when region selection changes */
  onChange: (next: string[]) => void;
  /** Currently selected ethnic / language group values */
  selectedEthnicGroups?: string[];
  /** Called when ethnic group selection changes */
  onEthnicGroupChange?: (next: string[]) => void;
  /** Optional class on the wrapper */
  className?: string;
}

/* ---------- Component ---------- */

export const RegionFilters: React.FC<RegionFiltersProps> = ({
  selected,
  onChange,
  selectedEthnicGroups = [],
  onEthnicGroupChange,
  className,
}) => {
  const handleRegionToggle = useCallback(
    (region: string) => {
      const next = selected.includes(region)
        ? selected.filter((r) => r !== region)
        : [...selected, region];
      onChange(next);
    },
    [selected, onChange]
  );

  const handleEthnicToggle = useCallback(
    (group: string) => {
      if (!onEthnicGroupChange) return;
      const next = selectedEthnicGroups.includes(group)
        ? selectedEthnicGroups.filter((g) => g !== group)
        : [...selectedEthnicGroups, group];
      onEthnicGroupChange(next);
    },
    [selectedEthnicGroups, onEthnicGroupChange]
  );

  return (
    <Card className={[styles.card, className].filter(Boolean).join(' ')}>
      <CardContent className={styles.content}>
        <h2 className={styles.title}>Filters</h2>

        <section className={styles.section} aria-labelledby="region-heading">
          <h3 id="region-heading" className={styles.sectionTitle}>
            REGION
          </h3>
          <ul className={styles.list} role="list">
            {REGION_OPTIONS.map((region) => (
              <li key={region} className={styles.item}>
                <Checkbox
                  id={`region-${region.replace(/\s+/g, '-').toLowerCase()}`}
                  label={region}
                  checked={selected.includes(region)}
                  onChange={() => handleRegionToggle(region)}
                  className={styles.checkbox}
                />
              </li>
            ))}
          </ul>
        </section>

        {onEthnicGroupChange && (
          <section
            className={styles.section}
            aria-labelledby="ethnic-heading"
          >
            <h3 id="ethnic-heading" className={styles.sectionTitle}>
              ETHNIC / LANGUAGE GROUP
            </h3>
            <p className={styles.sectionHint}>
              Turkic, Slavic, Germanic, Chinese (Han), etc. — communities
              linked by shared ancestry, culture, language, and historical
              identity.
            </p>
            <ul className={styles.list} role="list">
              {ETHNIC_GROUP_OPTIONS.map((group) => (
                <li key={group} className={styles.item}>
                  <Checkbox
                    id={`ethnic-${group.replace(/\s+/g, '-').replace(/[()]/g, '').toLowerCase()}`}
                    label={group}
                    checked={selectedEthnicGroups.includes(group)}
                    onChange={() => handleEthnicToggle(group)}
                    className={styles.checkbox}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}
      </CardContent>
    </Card>
  );
};
