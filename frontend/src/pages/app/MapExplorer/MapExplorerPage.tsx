import React, { useCallback, useState } from 'react';
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
import styles from './MapExplorerPage.module.css';

/* ==========================================================================
   MapExplorerPage
   Full-width map; country details panel slides in from the right on click.
   ========================================================================== */

const ENTER_ICON = '/assets/icons/actions/enter_button.svg';

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
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const handleCountryClick = useCallback((iso2: string) => {
    setSelectedCountry(iso2);
  }, []);

  const handleCountryHover = useCallback((iso2: string | null) => {
    setHoveredCountry(iso2);
  }, []);

  const handleEnterCountry = useCallback(() => {
    if (!selectedCountry) return;
    navigate(`/learn/${selectedCountry}`);
  }, [navigate, selectedCountry]);

  let details: MapCountryDetails | null = null;
  try {
    details = selectedCountry ? getMapCountryDetails(selectedCountry) : null;
  } catch {
    details = null;
  }
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
                  <CountryDetailsPanel details={details} onEnter={handleEnterCountry} />
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
