import React, { useCallback, useState } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import styles from './CountryCatalogCard.module.css';

/* ==========================================================================
   CountryCatalogCard
   Catalog-style country card for the Search Countries page.
   No settings menu — flag, name, description, Learn button only.
   
   Layout:
   ┌─────────────────────────────────┐
   │                                 │
   │     FLAG (full-width background)│
   │     aspect-ratio 3:2            │
   │                                 │
   ├─────────────────────────────────┤
   │  Country Name (bold)             │
   │  Short description (muted)     │
   ├─────────────────────────────────┤
   │                 [Learn] button  │
   └─────────────────────────────────┘
   ========================================================================== */

/* ==========================================================================
   Icon Path Map
   Put real filenames from /public/assets/icons/actions/ here
   ========================================================================== */
const ICON_PATHS = {
  /** Icon shown inside the Learn button (reuse overview.svg or replace with learn icon) */
  learn: '/assets/icons/actions/overview.svg',
} as const;

/* ---------- Helpers ---------- */

const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ');

/** 1x1 transparent placeholder for broken flag images */
const FLAG_PLACEHOLDER =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/* ==========================================================================
   Props
   ========================================================================== */

export interface CountryCatalogCardProps {
  /** Slug used as key and navigation param */
  code: string;
  /** Display name, e.g. "Japan" */
  name: string;
  /** Geographic region (optional, for accessibility) */
  region?: string;
  /** Short description / tagline */
  description: string;
  /** Full URL for the flag image from the backend */
  flagUrl?: string | null;
  /** Called when the Learn button is clicked */
  onLearn: (code: string) => void;
  /** Optional extra className */
  className?: string;
}

/* ==========================================================================
   Component
   ========================================================================== */

export const CountryCatalogCard: React.FC<CountryCatalogCardProps> = ({
  code,
  name,
  description,
  flagUrl,
  onLearn,
  className,
}) => {
  /* ---- State for flag image fallback ---- */
  const [flagSrc, setFlagSrc] = useState(flagUrl ?? `/assets/icons/countries/${code}.svg`);
  const [flagError, setFlagError] = useState(false);

  /** Handle flag image load error — show fallback */
  const handleFlagError = useCallback(() => {
    setFlagSrc(FLAG_PLACEHOLDER);
    setFlagError(true);
  }, []);

  /** First letter of country name (fallback when flag fails) */
  const initial = name.charAt(0).toUpperCase();

  /** Handle Learn button click */
  const handleLearnClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onLearn(code);
    },
    [code, onLearn]
  );

  return (
    <Card
      hoverable
      className={cx(styles.card, className)}
      role="article"
      aria-label={`${name} country card`}
    >
      {/* Flag area — full-width background, 3:2 aspect ratio */}
      <div className={styles.flagArea}>
        <img
          src={flagSrc}
          alt={`${name} flag`}
          className={styles.flagImage}
          onError={handleFlagError}
          draggable={false}
        />
        {flagError && (
          <span className={styles.flagFallback} aria-hidden="true">
            {initial}
          </span>
        )}
      </div>

      {/* Details area — name + description only */}
      <div className={styles.detailsArea}>
        <h3 className={styles.countryName}>{name}</h3>
        <p className={styles.countryDescription}>{description}</p>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Action area — Learn button at end */}
      <div className={styles.actionArea}>
        <Button
          variant="secondary"
          size="sm"
          className={styles.learnButton}
          onClick={handleLearnClick}
        >
          <img
            src={ICON_PATHS.learn}
            alt=""
            aria-hidden="true"
            width={16}
            height={16}
            className={styles.buttonIcon}
          />
          Learn
        </Button>
      </div>
    </Card>
  );
};
