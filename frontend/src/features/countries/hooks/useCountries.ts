import { useQuery } from '@tanstack/react-query';
import { Country } from '../../../types/models';
import { env } from '../../../app/config/env';

interface RawCountry {
  id: number;
  slug: string;
  name: string;
  region: string;
  description: string | null;
  flag_path: string | null;
  flag_url: string | null;
  is_active: boolean;
  ethnic_groups?: string[];
  created_at: string;
  updated_at: string;
}

const mapCountry = (raw: RawCountry): Country => ({
  id: raw.id,
  slug: raw.slug,
  name: raw.name,
  region: raw.region,
  description: raw.description,
  flagPath: raw.flag_path,
  flagUrl: raw.flag_url,
  isActive: raw.is_active,
  ethnicGroups: raw.ethnic_groups,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
});

const fetchCountries = async (): Promise<Country[]> => {
  const response = await fetch(`${env.API_URL}/api/countries`, {
    headers: {
        'Accept': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch countries. Please try again.');
  }

  const json = await response.json();
  return (json.data as RawCountry[]).map(mapCountry);
};

export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 5, 
  });
};
