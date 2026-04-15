import { useQuery } from '@tanstack/react-query';
import { Country } from '../../../types/models';
import { env } from '../../../app/config/env';

const fetchCountries = async (): Promise<Country[]> => {
  const response = await fetch(`${env.API_URL}/countries`, {
    headers: {
        'Accept': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch countries. Please try again.');
  }

  const json = await response.json();
  return json.data; 
};

export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 5, 
  });
};
