import React from 'react';
import styles from './Card.module.css';

/* ---------- Utility ---------- */
const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ');

/* ---------- Card ---------- */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adds a subtle lift effect on hover (useful for clickable cards) */
  hoverable?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  hoverable = false,
  className,
  children,
  ...rest
}) => (
  <div
    className={cx(styles.card, hoverable && styles.hoverable, className)}
    {...rest}
  >
    {children}
  </div>
);

/* ---------- CardHeader ---------- */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  className,
  children,
  ...rest
}) => (
  <div className={cx(styles.header, className)} {...rest}>
    {children}
  </div>
);

/* ---------- CardContent ---------- */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({
  className,
  children,
  ...rest
}) => (
  <div className={cx(styles.content, className)} {...rest}>
    {children}
  </div>
);

/* ---------- CardFooter ---------- */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  className,
  children,
  ...rest
}) => (
  <div className={cx(styles.footer, className)} {...rest}>
    {children}
  </div>
);
