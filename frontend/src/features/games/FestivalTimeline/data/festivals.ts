import { CountryInfo, FestivalData } from '../types';

export const COUNTRIES: CountryInfo[] = [
    { id: 'IN', name: 'India', flag: '🇮🇳' },
    { id: 'JP', name: 'Japan', flag: '🇯🇵' },
];

export const FESTIVAL_POOL: FestivalData[] = [
    // ── INDIA ──
    {
        id: 'fest_in_001',
        name: 'Makar Sankranti',
        countryId: 'IN',
        season: 'Winter',
        month: 1,
        shortFact: 'A harvest festival celebrated with kite flying and sesame sweets.',
        image: '🪁',
        difficultyLevel: 1,
    },
    {
        id: 'fest_in_002',
        name: 'Holi',
        countryId: 'IN',
        season: 'Spring',
        month: 3,
        shortFact: 'The Festival of Colors, celebrating the arrival of Spring and love.',
        image: '🎨',
        difficultyLevel: 1,
    },
    {
        id: 'fest_in_003',
        name: 'Onam',
        countryId: 'IN',
        season: 'Autumn',
        month: 8, // Aug/Sept
        shortFact: 'A harvest festival in Kerala marking the return of King Mahabali.',
        image: '🐘',
        difficultyLevel: 2,
    },
    {
        id: 'fest_in_004',
        name: 'Ganesh Chaturthi',
        countryId: 'IN',
        season: 'Autumn',
        month: 9, // Aug/Sept
        shortFact: 'Celebrates the birth of Lord Ganesha, the remover of obstacles.',
        image: '🐘',
        difficultyLevel: 1,
    },
    {
        id: 'fest_in_005',
        name: 'Navratri',
        countryId: 'IN',
        season: 'Autumn',
        month: 10, // Sept/Oct
        shortFact: 'A nine-night festival celebrating the divine feminine and dancing.',
        image: '💃',
        difficultyLevel: 2,
    },
    {
        id: 'fest_in_006',
        name: 'Diwali',
        countryId: 'IN',
        season: 'Autumn',
        month: 11, // Oct/Nov
        shortFact: 'The Festival of Lights, symbolizing the victory of light over darkness.',
        image: '🪔',
        difficultyLevel: 1,
    },

    // ── JAPAN ──
    {
        id: 'fest_jp_001',
        name: 'Sapporo Snow Festival',
        countryId: 'JP',
        season: 'Winter',
        month: 2,
        shortFact: 'Features massive, intricate ice and snow sculptures.',
        image: '❄️',
        difficultyLevel: 1,
    },
    {
        id: 'fest_jp_002',
        name: 'Hanami (Cherry Blossom)',
        countryId: 'JP',
        season: 'Spring',
        month: 4,
        shortFact: 'The elegant custom of enjoying the transient beauty of flowers.',
        image: '🌸',
        difficultyLevel: 1,
    },
    {
        id: 'fest_jp_003',
        name: 'Gion Matsuri',
        countryId: 'JP',
        season: 'Summer',
        month: 7,
        shortFact: 'Kyoto\'s biggest festival featuring massive floats.',
        image: '🏮',
        difficultyLevel: 2,
    },
    {
        id: 'fest_jp_004',
        name: 'Tanabata',
        countryId: 'JP',
        season: 'Summer',
        month: 7,
        shortFact: 'The Star Festival celebrating the meeting of Orihime and Hikoboshi.',
        image: '🎋',
        difficultyLevel: 1,
    },
    {
        id: 'fest_jp_005',
        name: 'Obon',
        countryId: 'JP',
        season: 'Summer',
        month: 8,
        shortFact: 'A Buddhist custom to honor the spirits of one\'s ancestors.',
        image: '👘',
        difficultyLevel: 1,
    },
    {
        id: 'fest_jp_006',
        name: 'Shichi-Go-San',
        countryId: 'JP',
        season: 'Autumn',
        month: 11,
        shortFact: 'Celebrates the growth of children aged three, five, and seven.',
        image: '👧',
        difficultyLevel: 2,
    }
];

export function getCountryInfo(countryId: string): CountryInfo | undefined {
    return COUNTRIES.find((c) => c.id === countryId);
}

export function getFestivalsForCountry(countryId: string): FestivalData[] {
    return FESTIVAL_POOL.filter((f) => f.countryId === countryId);
}
