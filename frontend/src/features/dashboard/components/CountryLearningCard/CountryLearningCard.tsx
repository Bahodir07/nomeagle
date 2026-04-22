import React, { useCallback } from 'react';
import { Card, CardContent, CardFooter } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { ProgressBar } from '../../../../components/ui/Progress';
import { Menu } from '../../../../components/ui/Menu';
import type { CountryProgress, CountryStatus } from '../../types';
import styles from './CountryLearningCard.module.css';

/* ==========================================================================
   CountryLearningCard
   Dashboard country card — supports grid (default) and list variants.
   Flag rendering priority:
   1) backend image URL
   2) backend emoji fallback
   3) first letter of country name
   ========================================================================== */

/* ---------- Icon paths ---------- */
const ICONS = {
    settings: '/assets/icons/actions/settings.svg',
    moreVertical: '/assets/icons/actions/menu_three_vertical_dot.svg',
} as const;

/* ---------- Menu item definitions ---------- */
const MENU_ITEM_RESET = { id: 'reset', label: 'Reset Progress' } as const;
const MENU_ITEM_REMOVE = { id: 'remove', label: 'Remove from\nDashboard', danger: true } as const;

/* ---------- Helpers ---------- */

const STATUS_BADGE: Record<
    CountryStatus,
    { label: string; variant: 'default' | 'info' | 'success' }
> = {
    not_started: { label: 'Not Started', variant: 'default' },
    in_progress: { label: 'In Progress', variant: 'info' },
    completed: { label: 'Completed', variant: 'success' },
};

const CTA_LABEL: Record<CountryStatus, string> = {
    not_started: 'Start',
    in_progress: 'Continue',
    completed: 'Review',
};

const progressColor = (status: CountryStatus) => {
    if (status === 'completed') return 'success' as const;
    return 'primary' as const;
};

/* ---------- Props ---------- */

export interface CountryLearningCardProps {
    country: CountryProgress;
    /** Called when the user clicks the CTA button */
    onAction?: (countryId: string) => void;
    /** Called when user selects "Reset Progress" from menu */
    onReset?: (countryId: string) => void;
    /** Called when user selects "Remove from Dashboard" from menu */
    onRemove?: (countryId: string) => void;
    /** Layout variant: 'grid' (default vertical card) or 'list' (compact horizontal row) */
    variant?: 'grid' | 'list';
}

/* ---------- Component ---------- */

export const CountryLearningCard: React.FC<CountryLearningCardProps> = ({
                                                                            country,
                                                                            onAction,
                                                                            onReset,
                                                                            onRemove,
                                                                            variant = 'grid',
                                                                        }) => {
    const {
        countryId,
        countryName,
        teaser,
        status,
        progressPct,
        lastLessonTitle,
        flagUrl,
        flagEmoji,
    } = country;

    const badge = STATUS_BADGE[status];
    const ctaLabel = CTA_LABEL[status];
    const ctaVariant = status === 'not_started' ? 'primary' : 'secondary';

    /** First letter of the country name, used as fallback */
    const initial = countryName.charAt(0).toUpperCase();

    const menuItems = [
        ...(onReset ? [MENU_ITEM_RESET] : []),
        ...(onRemove ? [MENU_ITEM_REMOVE] : []),
    ];

    /** Handle menu item selection */
    const handleMenuSelect = useCallback(
        (id: string) => {
            if (id === 'reset') {
                onReset?.(countryId);
            } else if (id === 'remove') {
                onRemove?.(countryId);
            }
        },
        [countryId, onReset, onRemove]
    );

    const renderFlag = () => {
        if (flagUrl) {
            return (
                <img
                    src={flagUrl}
                    alt={`${countryName} flag`}
                    className={styles.flagImage}
                    loading="lazy"
                />
            );
        }

        if (flagEmoji) {
            return (
                <span className={styles.flagEmoji} aria-label={`${countryName} flag`}>
          {flagEmoji}
        </span>
            );
        }

        return (
            <span className={styles.flagFallback} aria-hidden="true">
        {initial}
      </span>
        );
    };

    /* ========== List variant — compact horizontal row ========== */
    if (variant === 'list') {
        return (
            <div
                className={styles.listCard}
                role="article"
                aria-label={`${countryName} learning progress`}
            >
                <div className={styles.flagCircle}>{renderFlag()}</div>

                <div className={styles.listInfo}>
                    <h3 className={styles.listName}>{countryName}</h3>
                    <p className={styles.listTeaser}>{teaser}</p>
                </div>

                <div className={styles.listProgressSection}>
                    <div className={styles.listStatusRow}>
                        <Badge variant={badge.variant} size="sm">
                            {badge.label}
                        </Badge>
                        <span className={styles.listPct}>{progressPct}%</span>
                    </div>

                    <div className={styles.listProgress}>
                        <ProgressBar
                            value={progressPct}
                            color={progressColor(status)}
                            size="sm"
                            animated
                            animationKey={`${countryId}-${variant}`}
                        />
                    </div>
                </div>

                <Button
                    variant={ctaVariant}
                    size="sm"
                    onClick={() => onAction?.(countryId)}
                >
                    {ctaLabel}
                </Button>

                <Menu
                    trigger={
                        <button
                            className={styles.listMenuButton}
                            aria-label={`Actions for ${countryName}`}
                        >
                            <img src={ICONS.moreVertical} alt="" aria-hidden="true" />
                        </button>
                    }
                    items={menuItems}
                    onSelect={handleMenuSelect}
                    position="bottom-left"
                />
            </div>
        );
    }

    /* ========== Grid variant — vertical card (default) ========== */
    return (
        <Card hoverable className={styles.card}>
            <div className={styles.gridMenuWrapper}>
                <Menu
                    trigger={
                        <button
                            className={styles.gridMenuButton}
                            aria-label={`Actions for ${countryName}`}
                        >
                            <img src={ICONS.settings} alt="" aria-hidden="true" />
                        </button>
                    }
                    items={menuItems}
                    onSelect={handleMenuSelect}
                    position="right"
                />
            </div>

            <CardContent className={styles.body}>
                <div className={styles.headerRow}>
                    <div className={styles.identity}>
                        <div className={styles.flagCircle}>{renderFlag()}</div>
                        <h3 className={styles.name}>{countryName}</h3>
                    </div>

                    <Badge variant={badge.variant} size="sm">
                        {badge.label}
                    </Badge>
                </div>

                <p className={styles.teaser}>{teaser}</p>

                {status === 'in_progress' && lastLessonTitle && (
                    <p className={styles.lastLesson}>
                        <span className={styles.lastLessonLabel}>Last lesson:</span>{' '}
                        {lastLessonTitle}
                    </p>
                )}

                <div className={styles.progressRow}>
                    <ProgressBar
                        value={progressPct}
                        color={progressColor(status)}
                        size="sm"
                        animated
                        animationKey={`${countryId}-${variant}`}
                    />
                    <span className={styles.pct}>{progressPct}%</span>
                </div>
            </CardContent>

            <CardFooter>
                <Button
                    variant={ctaVariant}
                    size="sm"
                    onClick={() => onAction?.(countryId)}
                >
                    {ctaLabel}
                </Button>
            </CardFooter>
        </Card>
    );
};