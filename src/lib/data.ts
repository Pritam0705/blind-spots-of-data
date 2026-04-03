import { CountryData } from '../utils/api';

export async function fetchAllData(): Promise<CountryData[]> {
  const response = await fetch('/data/api_cache.json');
  if (!response.ok) {
    throw new Error(`Failed to load cached data: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return json as CountryData[];
}
