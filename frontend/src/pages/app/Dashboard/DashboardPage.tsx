import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';
import { Loading, ErrorState } from '../../../components/feedback';
import {
    CountryLearningCard,
    EmptyStateCard,
    StatsPanel,
    ViewToggle,
} from '../../../features/dashboard/components';
import type { ViewMode } from '../../../features/dashboard/components';
import { MOCK_WEEK_PROGRESS } from '../../../features/dashboard/mock/dashboard.mock';
import type { DashboardResponse, AsyncState } from '../../../features/dashboard/types';
import { getDashboard } from '../../../app/api/progress';
import styles from './DashboardPage.module.css';

/* ---------- localStorage key for view mode persistence ---------- */
const VIEW_MODE_STORAGE_KEY = 'ne.dashboard.countriesViewMode';

/** Get initial view mode from localStorage or default to 'grid' */
const getInitialViewMode = (): ViewMode => {
    try {
        const stored = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
        if (stored === 'list' || stored === 'grid') {
            return stored;
        }
    } catch {
        // localStorage not available
    }
    return 'grid';
};

export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();

    const [state, setState] = useState<AsyncState<DashboardResponse>>({
        status: 'loading',
    });

    /* ---- View mode state (persisted to localStorage) ---- */
    const [viewMode, setViewMode] = useState<ViewMode>(getInitialViewMode);

    /** Handle view mode change and persist to localStorage */
    const handleViewModeChange = useCallback((mode: ViewMode) => {
        setViewMode(mode);

        try {
            localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
        } catch {
            // localStorage not available
        }
    }, []);

    const loadDashboard = useCallback(async () => {
        setState({ status: 'loading' });

        try {
            const data = await getDashboard();
            setState({ status: 'success', data });
        } catch (err) {
            setState({ status: 'error', error: String(err) });
        }
    }, []);

    /** Handle reset progress action from card menu */
    const handleResetProgress = useCallback((countryId: string) => {
        // TODO: Implement reset progress API call
        console.log('Reset progress for country:', countryId);
    }, []);

    /** Handle remove from dashboard action from card menu */
    const handleRemoveFromDashboard = useCallback((countryId: string) => {
        // TODO: Implement remove-from-dashboard API call if needed
        console.log('Remove from dashboard:', countryId);
    }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    /* ---- Loading ---- */
    if (state.status === 'loading' || state.status === 'idle') {
        return (
            <div className={styles.grid}>
                <div className={styles.left}>
                    <Card>
                        <CardContent>
                            <Loading rows={2} columns={2} blockHeight={180} />
                        </CardContent>
                    </Card>
                </div>

                <div className={styles.right}>
                    <Loading rows={4} columns={1} blockHeight={120} showHeading={false} />
                </div>
            </div>
        );
    }

    /* ---- Error ---- */
    if (state.status === 'error') {
        return (
            <Card>
                <CardContent>
                    <ErrorState message={state.error} onRetry={loadDashboard} />
                </CardContent>
            </Card>
        );
    }

    /* ---- Success ---- */
    const { user, activeCountries } = state.data;

    return (
        <div className={styles.grid}>
            {/* ── Left column: country cards ────────────────────────────── */}
            <section className={styles.left}>
                <Card>
                    <CardHeader className={styles.cardHeader}>
                        <h2 className={styles.sectionTitle}>My Learning Countries</h2>
                        <ViewToggle value={viewMode} onChange={handleViewModeChange} />
                    </CardHeader>

                    <CardContent>
                        {activeCountries.length > 0 ? (
                            <div className={viewMode === 'grid' ? styles.countryGrid : styles.countryList}>
                                {activeCountries.map((country) => (
                                    <CountryLearningCard
                                        key={country.countryId}
                                        country={country}
                                        variant={viewMode}
                                        onAction={(id) => navigate(`/app/countries/${id}/learn`)}
                                        onReset={handleResetProgress}
                                        onRemove={handleRemoveFromDashboard}
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyStateCard
                                onAction={() => {
                                    // TODO: adjust route if your browse page differs
                                    navigate('/app/browse');
                                }}
                            />
                        )}
                    </CardContent>
                </Card>
            </section>

            {/* ── Right column: stats ───────────────────────────────────── */}
            <section className={styles.right}>
                <StatsPanel stats={user} weekProgress={MOCK_WEEK_PROGRESS} />
            </section>
        </div>
    );
};