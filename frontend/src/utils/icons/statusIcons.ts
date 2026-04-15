/* ==========================================================================
   Status Icon Paths
   Typed helper for status/gamification SVGs.

   Icons live in: public/assets/icons/status/
   ========================================================================== */

/**
 * Known status icon names.
 */
export const STATUS_ICONS = {
  streak_fire:  '/assets/icons/status/streak_day_fire.svg',
  running_man:  '/assets/icons/status/running_man.svg',
} as const;

export type StatusIconName = keyof typeof STATUS_ICONS;

/**
 * Get the path for a status icon by name.
 * Returns `undefined` when the name is not in the registry.
 */
export function getStatusIconPath(
  name: string,
): string | undefined {
  return (STATUS_ICONS as Record<string, string>)[name];
}
