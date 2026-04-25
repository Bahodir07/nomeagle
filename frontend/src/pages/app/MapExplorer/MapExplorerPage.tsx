import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ProgressBar } from '../../../components/ui/Progress';
import { WorldMap } from '../../../features/map/components';
import {
  getMapCountryDetails,
  formatPopulation,
  type MapCountryDetails,
} from '../../../features/map/data/mapCountryDetails';
import { getDashboard } from '../../../app/api/progress';
import type { DashboardResponse } from '../../../features/dashboard/types';
import styles from './MapExplorerPage.module.css';

/* ==========================================================================
   MapExplorerPage
   Full-width map; country details panel slides in from the right on click.
   ========================================================================== */

const ENTER_ICON = '/assets/icons/actions/enter_button.svg';

/* ISO2 → backend slug.
   The backend stores country names as nationality adjectives (e.g. "Turkish", "Thai"),
   so slugs follow that form too. Only confirmed DB entries are used; unrecognised
   countries fall through to a 404 → "In Development" page.
   Add new entries here as countries are seeded in the backend. */
const BACKEND_SLUG: Record<string, string> = {
  TR: 'turkish',
  ES: 'spanish',
  TH: 'thai',
  JP: 'japanese',
  IT: 'italian',
  BR: 'brazilian',
  FR: 'french',
  MX: 'mexican',
  IN: 'indian',
  DE: 'german',
  KR: 'korean',
  AU: 'australian',
  EG: 'egyptian',
  GB: 'british',
  RU: 'russian',
  KZ: 'kazakh',
  US: 'american',
  CN: 'chinese',
  CA: 'canadian',
};

function ComingSoonPanel({ details }: { details: MapCountryDetails }) {
  return (
    <>
      <div className={styles.metaRow}>
        <img
          src={`/assets/icons/countries/${details.code}.svg`}
          alt=""
          className={styles.flag}
        />
        <div className={styles.metaText}>
          <h2 className={styles.countryName}>{details.name}</h2>
          <p className={styles.region}>{details.region}</p>
        </div>
      </div>
      <p className={styles.hook}>{details.hookSentence}</p>
      <div className={`${styles.infoBox} ${styles.comingSoonBox}`}>
        <p className={styles.reason}>
          This country isn't available in the platform yet. Check back soon!
        </p>
      </div>
    </>
  );
}

function CountryDetailsPanel({
  details,
  onEnter,
}: {
  details: MapCountryDetails;
  onEnter: () => void;
}) {
  const pop = formatPopulation(details.population);

  return (
    <>
      <div className={styles.heroWrap}>
        <img
          src={details.heroImageUrl}
          alt=""
          className={styles.heroImage}
        />
      </div>

      <div className={styles.metaRow}>
        <img
          src={`/assets/icons/countries/${details.code}.svg`}
          alt=""
          className={styles.flag}
        />
        <div className={styles.metaText}>
          <h2 className={styles.countryName}>{details.name}</h2>
          <p className={styles.capital}>{details.capital}</p>
          <p className={styles.region}>{details.region}</p>
          <p className={styles.population}>Population: {pop}</p>
        </div>
      </div>

      <p className={styles.hook}>{details.hookSentence}</p>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Cultural highlights</h3>
        <ul className={styles.highlights}>
          {details.culturalHighlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </div>

      <div className={styles.infoBox}>
        <p className={styles.reason}>
          <strong>Why learn?</strong> {details.reasonToLearn}
        </p>
      </div>

      <div className={`${styles.infoBox} ${styles.funFactBox}`}>
        <p className={styles.funFact}>
          <strong>Fun fact:</strong> {details.funFact}
        </p>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Progress</span>
          <span className={styles.progressPct}>{details.progressPct}%</span>
        </div>
        <ProgressBar
          value={details.progressPct}
          color="primary"
          size="sm"
          animated
          animationKey={details.code}
        />
      </div>

      <div className={styles.masteryRow}>
        <span className={styles.masteryLabel}>Mastery</span>
        <span className={styles.stars} aria-label={`${details.masteryStars} of 3 stars`}>
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={n <= details.masteryStars ? styles.starOn : styles.starOff}
              aria-hidden="true"
            >
              ★
            </span>
          ))}
        </span>
      </div>

      <div className={styles.actionRow}>
        <Button
          variant="primary"
          size="md"
          onClick={onEnter}
          className={styles.enterButton}
        >
          <img src={ENTER_ICON} alt="" className={styles.enterIcon} aria-hidden />
          Enter country
        </Button>
      </div>
    </>
  );
}

export const MapExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    getDashboard()
      .then((data) => setDashboard(data))
      .catch(() => { /* silently ignore — green coloring is best-effort */ });
  }, []);

  const slugToISO2 = useMemo(
    () => Object.fromEntries(Object.entries(BACKEND_SLUG).map(([iso2, slug]) => [slug, iso2])),
    [],
  );

  const completedISO2 = useMemo<string[]>(() => {
    if (!dashboard) return [];
    return dashboard.activeCountries
      .filter((c) => c.progressPct >= 100 || c.status === 'completed')
      .map((c) => slugToISO2[c.countryId])
      .filter(Boolean) as string[];
  }, [dashboard, slugToISO2]);

  const inProgressISO2 = useMemo<string[]>(() => {
    if (!dashboard) return [];
    return dashboard.activeCountries
      .filter((c) => c.progressPct > 0 && c.progressPct < 100 && c.status !== 'completed')
      .map((c) => slugToISO2[c.countryId])
      .filter(Boolean) as string[];
  }, [dashboard, slugToISO2]);

  const handleCountryClick = useCallback((iso2: string) => {
    setSelectedCountry(iso2);
  }, []);

  const handleCountryHover = useCallback((_iso2: string | null) => {
    /* hover state reserved for future tooltip use */
  }, []);

  let details: MapCountryDetails | null = null;
  try {
    details = selectedCountry ? getMapCountryDetails(selectedCountry) : null;
  } catch {
    details = null;
  }

  const hasCourseContent = useCallback(
    (iso2: string) => Boolean(BACKEND_SLUG[iso2.toUpperCase()]),
    [],
  );

  const handleEnterCountry = useCallback(() => {
    if (!selectedCountry) return;
    const slug = BACKEND_SLUG[selectedCountry.toUpperCase()];
    navigate(`/app/countries/${slug ?? selectedCountry.toLowerCase()}/learn`);
  }, [navigate, selectedCountry]);

  const panelOpen = Boolean(selectedCountry);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Map Explorer</h1>
        <p className={styles.subtitle}>
          Click a country to explore its traditions, food, festivals and more.
        </p>
      </header>

      <div className={styles.layout}>
        <div className={styles.mapColumn}>
          <Card className={styles.mapCard}>
            <CardContent className={styles.mapContent}>
              <WorldMap
                height={560}
                selectedCountry={selectedCountry ?? undefined}
                onCountryClick={handleCountryClick}
                onCountryHover={handleCountryHover}
                completedCountries={completedISO2}
                inProgressCountries={inProgressISO2}
              />
            </CardContent>
          </Card>
        </div>

        {panelOpen && (
          <div className={styles.panelColumn} role="dialog" aria-label="Country details">
            <Card className={styles.panelCard}>
              <CardHeader className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Country details</h2>
              </CardHeader>
              <CardContent className={styles.panelContent}>
                {details ? (
                  hasCourseContent(selectedCountry!) ? (
                    <CountryDetailsPanel details={details} onEnter={handleEnterCountry} />
                  ) : (
                    <ComingSoonPanel details={details} />
                  )
                ) : (
                  <p className={styles.emptyHint}>
                    Loading details for {selectedCountry}…
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
