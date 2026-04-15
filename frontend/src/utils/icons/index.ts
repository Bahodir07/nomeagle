/* ==========================================================================
   Icon Utilities — Barrel Export
   ========================================================================== */

// Navigation icons (sidebar / nav bar)
export {
  NAVIGATION_ICONS,
  getNavigationIconPath,
} from './navigationIcons';
export type { NavigationIconName } from './navigationIcons';

// Country flags (ISO2 codes)
export { getCountryFlagPath } from './countryFlags';

// Status / gamification icons
export {
  STATUS_ICONS,
  getStatusIconPath,
} from './statusIcons';
export type { StatusIconName } from './statusIcons';

/* --------------------------------------------------------------------------
   Unified resolver
   Given a category + name, returns the public URL path.
   -------------------------------------------------------------------------- */

import { getNavigationIconPath } from './navigationIcons';
import { getCountryFlagPath } from './countryFlags';
import { getStatusIconPath } from './statusIcons';

export type IconCategory = 'navigation' | 'countries' | 'status';

/**
 * Resolve any icon to its public URL path.
 *
 * @returns The path string, or `undefined` if no match found in the
 *          registry (countries always returns a path since it's pattern-based).
 */
export function resolveIconPath(
  category: IconCategory,
  name: string,
): string | undefined {
  switch (category) {
    case 'navigation':
      return getNavigationIconPath(name);
    case 'countries':
      return getCountryFlagPath(name);
    case 'status':
      return getStatusIconPath(name);
    default:
      return undefined;
  }
}
