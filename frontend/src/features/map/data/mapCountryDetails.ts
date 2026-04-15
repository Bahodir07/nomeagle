/* ==========================================================================
   Map Explorer — country details for the right panel
   Extends catalog with capital, population, cultural highlights, etc.
   ========================================================================== */

import { getCountryByCode } from '../../countries/data';

export interface MapCountryDetails {
  code: string;
  name: string;
  capital: string;
  region: string;
  population: number;
  hookSentence: string;
  culturalHighlights: [string, string, string];
  reasonToLearn: string;
  funFact: string;
  heroImageUrl: string;
  progressPct: number;
  masteryStars: number;
  capitalLat: number;
  capitalLng: number;
}

/** Rounded population for display (e.g. 127000000 → "127M") */
export function formatPopulation(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/** Extended details for catalog countries (capital, population, highlights, etc.) */
const MAP_DETAILS: Record<string, Omit<MapCountryDetails, 'code' | 'name' | 'region' | 'hookSentence'>> = {
  jp: {
    capital: 'Tokyo',
    population: 125_800_000,
    culturalHighlights: ['Tea ceremony', 'Cherry blossom festivals', 'Anime & manga'],
    reasonToLearn: 'Understand one of the world\'s most distinct cultures and its global influence.',
    funFact: 'Japan has more than 5.5 million vending machines—one for about every 23 people.',
    heroImageUrl: '/assets/icons/countries/jp.svg',
    progressPct: 0,
    masteryStars: 0,
    capitalLat: 35.6762,
    capitalLng: 139.6503,
  },
  it: {
    capital: 'Rome',
    population: 59_100_000,
    culturalHighlights: ['Opera & classical music', 'Cuisine & wine', 'Renaissance art'],
    reasonToLearn: 'Connect with a culture that shaped Western art, food, and lifestyle.',
    funFact: 'Italy has more UNESCO World Heritage sites than any other country.',
    heroImageUrl: '/assets/icons/countries/it.svg',
    progressPct: 0,
    masteryStars: 0,
    capitalLat: 41.9028,
    capitalLng: 12.4964,
  },
  br: {
    capital: 'Brasília',
    population: 215_000_000,
    culturalHighlights: ['Samba & carnival', 'Capoeira', 'Amazon traditions'],
    reasonToLearn: 'Experience the diversity of the largest country in South America.',
    funFact: 'Brazil is the only country that has hosted both the FIFA World Cup and the Olympics in the same year (2016).',
    heroImageUrl: '/assets/icons/countries/br.svg',
    progressPct: 0,
    masteryStars: 0,
    capitalLat: -15.8267,
    capitalLng: -47.9218,
  },
  fr: {
    capital: 'Paris',
    population: 67_800_000,
    culturalHighlights: ['Wine & cheese', 'Fashion', 'Philosophy & literature'],
    reasonToLearn: 'Appreciate a culture at the heart of European art and gastronomy.',
    funFact: 'The French eat about 30,000 tons of snails per year.',
    heroImageUrl: '/assets/icons/countries/fr.svg',
    progressPct: 0,
    masteryStars: 0,
    capitalLat: 48.8566,
    capitalLng: 2.3522,
  },
  mx: {
    capital: 'Mexico City',
    population: 130_000_000,
    culturalHighlights: ['Day of the Dead', 'Mariachi', 'Ancient Mesoamerican heritage'],
    reasonToLearn: 'Discover a blend of indigenous and colonial traditions.',
    funFact: 'Mexico introduced chocolate, corn, and chilies to the world.',
    heroImageUrl: '/assets/icons/countries/mx.svg',
    progressPct: 0,
    masteryStars: 0,
    capitalLat: 19.4326,
    capitalLng: -99.1332,
  },
  in: {
    capital: 'New Delhi',
    population: 1_430_000_000,
    culturalHighlights: ['Bollywood', 'Yoga & Ayurveda', 'Festivals (Diwali, Holi)'],
    reasonToLearn: 'Explore one of the world\'s oldest and most diverse civilizations.',
    funFact: 'India has the largest number of vegetarians in the world.',
    heroImageUrl: '/assets/icons/countries/in.svg',
    progressPct: 0,
    masteryStars: 0,
    capitalLat: 28.6139,
    capitalLng: 77.2090,
  },
  de: {
    capital: 'Berlin',
    population: 84_300_000,
    culturalHighlights: ['Oktoberfest', 'Classical music', 'Engineering & innovation'],
    reasonToLearn: 'Understand a culture known for precision and rich history.',
    funFact: 'Germany has over 1,500 different types of sausages.',
    heroImageUrl: '/assets/icons/countries/de.svg',
    progressPct: 0,
    masteryStars: 0,
    capitalLat: 52.5200,
    capitalLng: 13.4050,
  },
  kr: {
    capital: 'Seoul',
    population: 51_700_000,
    culturalHighlights: ['K-pop', 'Hanbok', 'Korean cuisine'],
    reasonToLearn: 'Engage with a culture driving global trends in music and media.',
    funFact: 'South Korea has the world\'s fastest average internet speed.',
    heroImageUrl: '/assets/icons/countries/kr.svg',
    progressPct: 0,
    masteryStars: 0,
    capitalLat: 37.5665,
    capitalLng: 126.9780,
  },
  au: {
    capital: 'Canberra',
    population: 26_000_000,
    culturalHighlights: ['Aboriginal culture', 'Outback', 'Surf & beach lifestyle'],
    reasonToLearn: 'Learn about a unique blend of indigenous and modern Western culture.',
    funFact: 'Australia has 10,685 beaches—you could visit a new one every day for 29 years.',
    heroImageUrl: '/assets/icons/countries/au.svg',
    progressPct: 0,
    masteryStars: 0,
    capitalLat: -35.2809,
    capitalLng: 149.1300,
  },
  eg: {
    capital: 'Cairo',
    population: 109_000_000,
    culturalHighlights: ['Ancient pyramids', 'Nile heritage', 'Arabic calligraphy'],
    reasonToLearn: 'Uncover one of the cradles of civilization.',
    funFact: 'The Great Pyramid was the tallest human-made structure for 3,800 years.',
    heroImageUrl: '/assets/icons/countries/eg.svg',
    progressPct: 0,
    masteryStars: 0,
    capitalLat: 30.0444,
    capitalLng: 31.2357,
  },
  gb: {
    capital: 'London',
    population: 67_700_000,
    culturalHighlights: ['Afternoon tea', 'Royal heritage', 'Theatre & literature'],
    reasonToLearn: 'Explore traditions that have influenced English-speaking cultures worldwide.',
    funFact: 'The UK has no single official written constitution.',
    heroImageUrl: '/assets/icons/countries/gb.svg',
    progressPct: 0,
    masteryStars: 0,
    capitalLat: 51.5074,
    capitalLng: -0.1278,
  },
  th: {
    capital: 'Bangkok',
    population: 71_800_000,
    culturalHighlights: ['Temple etiquette', 'Street food', 'Muay Thai'],
    reasonToLearn: 'Experience the Land of Smiles and its Buddhist traditions.',
    funFact: 'Thailand is the only Southeast Asian country never colonized by Europe.',
    heroImageUrl: '/assets/icons/countries/th.svg',
    progressPct: 0,
    masteryStars: 0,
    capitalLat: 13.7563,
    capitalLng: 100.5018,
  },
  ru: {
    capital: 'Moscow',
    population: 143_400_000,
    culturalHighlights: ['Ballet & theatre', 'Literature (Tolstoy, Dostoevsky)', 'Space exploration heritage'],
    reasonToLearn: 'Understand the world\'s largest country and its rich literary history.',
    funFact: 'Russia spans 11 time zones, more than any other country.',
    heroImageUrl: '/assets/icons/countries/ru.svg',
    progressPct: 0,
    masteryStars: 0,
    capitalLat: 55.7558,
    capitalLng: 37.6173,
  },
  kz: {
    capital: 'Astana',
    population: 19_800_000,
    culturalHighlights: ['Nomadic traditions', 'Nauryz (Spring Festival)', 'Equestrian sports'],
    reasonToLearn: 'Explore the heart of Central Asia and its deep nomadic heritage.',
    funFact: 'Kazakhstan is the world\'s largest landlocked country.',
    heroImageUrl: '/assets/icons/countries/kz.svg',
    progressPct: 0,
    masteryStars: 0,
    capitalLat: 51.1694,
    capitalLng: 71.4491,
  },
};

const DEFAULT_DETAILS: Omit<MapCountryDetails, 'code' | 'name' | 'region' | 'hookSentence'> = {
  capital: '—',
  population: 0,
  culturalHighlights: ['—', '—', '—'],
  reasonToLearn: 'Explore this country\'s culture and traditions.',
  funFact: 'Select a country from the catalog for more details.',
  heroImageUrl: '',
  progressPct: 0,
  masteryStars: 0,
  capitalLat: 0,
  capitalLng: 0,
};

/**
 * Returns full country details for the map explorer panel.
 * Uses catalog + MAP_DETAILS for known countries; falls back to defaults for others.
 */
export function getMapCountryDetails(iso2: string): MapCountryDetails {
  const code = iso2.toLowerCase();
  const catalog = getCountryByCode(code);
  const extended = MAP_DETAILS[code] ?? DEFAULT_DETAILS;

  return {
    code,
    name: catalog?.name ?? code.toUpperCase(),
    region: catalog?.region ?? '—',
    hookSentence: catalog?.description ?? 'Explore this country.',
    ...extended,
    heroImageUrl: extended.heroImageUrl || `/assets/icons/countries/${code}.svg`,
  };
}
