/* ==========================================================================
   Countries Catalog — shared list for Search grid and Dashboard
   Single source of truth for country code, name, region, description.
   ========================================================================== */

import type { Region } from '../../../types/models';

export interface CatalogCountry {
  code: string;
  name: string;
  region: Region;
  description: string;
  ethnicGroups?: string[];
}

export const COUNTRIES_CATALOG: CatalogCountry[] = [
  {
    code: 'jp',
    name: 'Japan',
    region: 'Asia',
    description: 'Master bowing and the art of sushi etiquette.',
    ethnicGroups: ['East Asian'],
  },
  {
    code: 'it',
    name: 'Italy',
    region: 'Europe',
    description: 'Discover pasta traditions and expressive gestures.',
    ethnicGroups: ['Romance'],
  },
  {
    code: 'br',
    name: 'Brazil',
    region: 'South America',
    description: 'Learn samba rhythms and carnival culture.',
    ethnicGroups: ['Romance'],
  },
  {
    code: 'fr',
    name: 'France',
    region: 'Europe',
    description: 'Explore wine, cheese, and the art of conversation.',
    ethnicGroups: ['Romance'],
  },
  {
    code: 'mx',
    name: 'Mexico',
    region: 'North America',
    description: 'Experience vibrant fiestas and rich culinary heritage.',
    ethnicGroups: ['Romance'],
  },
  {
    code: 'in',
    name: 'India',
    region: 'Asia',
    description: 'Dive into diverse traditions and colorful festivals.',
    ethnicGroups: ['Indic'],
  },
  {
    code: 'de',
    name: 'Germany',
    region: 'Europe',
    description: 'Appreciate precision, beer gardens, and Oktoberfest.',
    ethnicGroups: ['Germanic'],
  },
  {
    code: 'kr',
    name: 'South Korea',
    region: 'Asia',
    description: 'Embrace K-pop culture and traditional Hanbok attire.',
    ethnicGroups: ['East Asian'],
  },
  {
    code: 'au',
    name: 'Australia',
    region: 'Oceania',
    description: 'Discover outback adventures and laid-back lifestyle.',
    ethnicGroups: ['Germanic'],
  },
  {
    code: 'eg',
    name: 'Egypt',
    region: 'Africa',
    description: 'Uncover ancient pyramids and Nile river heritage.',
    ethnicGroups: ['Arabic'],
  },
  {
    code: 'gb',
    name: 'United Kingdom',
    region: 'Europe',
    description: 'Explore royal traditions and afternoon tea customs.',
    ethnicGroups: ['Germanic'],
  },
  {
    code: 'th',
    name: 'Thailand',
    region: 'Asia',
    description: 'Experience temple etiquette and spicy street food.',
    ethnicGroups: ['East Asian'],
  },
];

export function getCountryByCode(code: string): CatalogCountry | undefined {
  return COUNTRIES_CATALOG.find((c) => c.code === code);
}
