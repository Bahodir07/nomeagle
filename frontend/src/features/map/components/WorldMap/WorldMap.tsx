import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createWorldMapAdapter } from '../../adapters';
import type { WorldMapAdapter } from '../../adapters';
import { ErrorState } from '../../../../components/feedback';
import styles from './WorldMap.module.css';

/* ---------- Props ---------- */

export interface WorldMapProps {
  /** Container height in pixels. @default 520 */
  height?: number;
  /** Extra class name for the root container */
  className?: string;
  /** When true, disables map interactions (e.g. click, hover) */
  disabled?: boolean;
  /** ISO2 code of the country to highlight, if the library supports it */
  selectedCountry?: string;
  /** Called when a country is clicked. ISO2 code if detectable. */
  onCountryClick?: (iso2: string) => void;
  /** Called when hover enters a country (iso2) or leaves (null). */
  onCountryHover?: (iso2: string | null) => void;
  /** ISO2 codes of countries to paint green (100% complete). */
  completedCountries?: string[];
  /** ISO2 codes of countries to paint orange (in progress). */
  inProgressCountries?: string[];
  /** Per-country color overrides for heatmap visualizations. ISO2 → CSS color. */
  heatmapColors?: Record<string, string>;
}

/* ---------- Component ---------- */

export const WorldMap: React.FC<WorldMapProps> = ({
  height = 520,
  className,
  disabled = false,
  selectedCountry,
  onCountryClick,
  onCountryHover,
  completedCountries,
  inProgressCountries,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const adapterRef = useRef<WorldMapAdapter | null>(null);
  const handlersRef = useRef({ onCountryClick, onCountryHover });
  handlersRef.current = { onCountryClick, onCountryHover };
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const mapEl = mapRef.current;
    if (!mapEl) return;

    const adapter = createWorldMapAdapter();
    adapterRef.current = adapter;
    setStatus('loading');

    const init = async (): Promise<void> => {
      try {
        await adapter.init(mapEl, { height }, {
          onCountryClick: (iso2) => handlersRef.current.onCountryClick?.(iso2),
          onCountryHover: (iso2) => handlersRef.current.onCountryHover?.(iso2 ?? null),
        });
        setStatus('ready');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load map.';
        setErrorMessage(message);
        setStatus('error');
      }
    };

    init();
    return () => {
      adapter.destroy();
      adapterRef.current = null;
    };
  }, [height]);

  useEffect(() => {
    if (status !== 'ready' || disabled) return;
    adapterRef.current?.setSelectedCountry(selectedCountry);
  }, [status, disabled, selectedCountry]);

  useEffect(() => {
    if (status !== 'ready') return;
    const mapEl = mapRef.current;
    if (!mapEl) return;

    const run = (): void => {
      adapterRef.current?.setSelectedCountry(selectedCountry);
    };
    run();
    const t1 = window.setTimeout(run, 150);
    const t2 = window.setTimeout(run, 500);
    const t3 = window.setTimeout(run, 1200);

    const observer = new MutationObserver(run);
    observer.observe(mapEl, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      observer.disconnect();
    };
  }, [status, selectedCountry]);

  useEffect(() => {
    if (status !== 'ready') return;
    adapterRef.current?.setCompletedCountries?.(completedCountries ?? []);
  }, [status, completedCountries]);

  useEffect(() => {
    if (status !== 'ready') return;
    adapterRef.current?.setInProgressCountries?.(inProgressCountries ?? []);
  }, [status, inProgressCountries]);

  const loadMap = useCallback(() => {
    setStatus('loading');
    setErrorMessage('');
    adapterRef.current?.destroy();
    adapterRef.current = null;
    const mapEl = mapRef.current;
    if (!mapEl) return;
    const adapter = createWorldMapAdapter();
    adapterRef.current = adapter;
    Promise.resolve(
      adapter.init(mapEl, { height }, {
        onCountryClick: (iso2) => handlersRef.current.onCountryClick?.(iso2),
        onCountryHover: (iso2) => handlersRef.current.onCountryHover?.(iso2 ?? null),
      })
    )
      .then(() => setStatus('ready'))
      .catch((err: unknown) => {
        setErrorMessage(err instanceof Error ? err.message : 'Failed to load map.');
        setStatus('error');
      });
  }, [height]);

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      style={{ height }}
      data-status={status}
      data-disabled={disabled || undefined}
      data-selected-country={selectedCountry || undefined}
    >
      {status === 'loading' && (
        <div className={styles.fallback} aria-live="polite">
          <div className={styles.loadingContent}>
            <span className={styles.loadingSpinner} aria-hidden="true" />
            <p className={styles.loadingText}>Loading map…</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className={styles.fallback}>
          <ErrorState
            message={errorMessage}
            onRetry={loadMap}
            retryLabel="Reload map"
            className={styles.errorState}
          />
        </div>
      )}

      <div
        ref={containerRef}
        className={styles.mapWrapper}
        style={{ minHeight: height }}
        role={status === 'ready' ? 'img' : undefined}
        aria-label={status === 'ready' ? 'Interactive world map' : undefined}
      >
        <div
          id="map"
          ref={mapRef}
          className={styles.mapDiv}
          style={{ height, pointerEvents: disabled ? 'none' : 'auto' }}
        />
      </div>
    </div>
  );
};
