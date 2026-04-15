import React, { useCallback, useState } from 'react';
import { resolveIconPath } from '../../../utils/icons';
import type { IconCategory } from '../../../utils/icons';
import styles from './Icon.module.css';

/* ==========================================================================
   Icon — Lightweight, typed icon component

   Renders an <img> element that loads an SVG from /public/assets/icons/.
   Supports navigation, country flag, and status icon categories.

   Usage:
     <Icon category="countries" name="jp" />
     <Icon category="navigation" name="dashboard" size={24} alt="Dashboard" />
     <Icon category="status" name="streak_fire" size={16} />
   ========================================================================== */

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Icon name — must match a registered key or ISO2 code */
  name: string;
  /** Which icon category to look up */
  category: IconCategory;
  /** Pixel size (width & height). Default 20 — 8px-grid friendly. */
  size?: number;
  /** Accessible alt text. When omitted the icon is treated as decorative. */
  alt?: string;
}

/** 1×1 transparent GIF used as fallback when the icon fails to load */
const FALLBACK =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export const Icon: React.FC<IconProps> = ({
  name,
  category,
  size = 20,
  alt,
  className,
  style,
  ...rest
}) => {
  const src = resolveIconPath(category, name) ?? FALLBACK;
  const [imgSrc, setImgSrc] = useState(src);

  /** Swap to fallback on load error so a broken-image icon never shows */
  const handleError = useCallback(() => {
    setImgSrc(FALLBACK);
  }, []);

  const isDecorative = !alt;

  return (
    <span
      className={`${styles.wrapper}${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size, ...style }}
      {...rest}
    >
      <img
        className={styles.img}
        src={imgSrc}
        width={size}
        height={size}
        alt={alt ?? ''}
        aria-hidden={isDecorative ? true : undefined}
        onError={handleError}
        draggable={false}
      />
    </span>
  );
};
