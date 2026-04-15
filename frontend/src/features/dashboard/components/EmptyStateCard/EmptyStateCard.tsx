import React from 'react';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import styles from './EmptyStateCard.module.css';

/* ---------- Props ---------- */

export interface EmptyStateCardProps {
  /** Override the default empty-state message */
  message?: string;
  /** Label for the CTA button */
  actionLabel?: string;
  /** Called when the user clicks the CTA */
  onAction?: () => void;
}

/* ---------- Component ---------- */

export const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
  message = "You haven't started exploring yet 🌍",
  actionLabel = 'Browse Countries',
  onAction,
}) => (
  <Card>
    <CardContent className={styles.body}>
      <span className={styles.icon} aria-hidden="true">🗺️</span>
      <p className={styles.message}>{message}</p>
      <Button variant="primary" size="md" onClick={onAction}>
        {actionLabel}
      </Button>
    </CardContent>
  </Card>
);
