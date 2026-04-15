/* ==========================================================================
   Country Flag Icon Paths
   Typed helper for country flag SVGs.

   Icons live in: public/assets/icons/countries/
   Naming convention: <iso2>.svg  (lowercase, e.g. jp.svg, it.svg)
   ========================================================================== */

/** Base path to the country flag icon directory */
const FLAGS_DIR = '/assets/icons/countries';

/**
 * Build the path for a country flag SVG.
 *
 * @param iso2  Lowercase ISO 3166-1 alpha-2 code (e.g. "jp", "br").
 *              The function normalises to lowercase automatically.
 * @returns     URL path like "/assets/icons/countries/jp.svg"
 */
export function getCountryFlagPath(iso2: string): string {
  return `${FLAGS_DIR}/${iso2.toLowerCase()}.svg`;
}
