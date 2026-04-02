
import axios from 'axios';

export interface IndicatorData {
  latest_year: number;
  latest_value: number;
  history: { Year: number; value: number }[];
}

export interface CountryData {
  code: string;
  name: string;
  visibility_index: number;
  visibility_band: string;
  metrics: {
    coverage: number;
    recency: number;
    continuity: number;
  };
  indicators: Record<string, IndicatorData | null>;
}

export interface OverviewData {
  total_countries: number;
  avg_visibility: number;
  bands: Record<string, number>;
}

export const fetchAllData = async (): Promise<CountryData[]> => {
  const response = await axios.get('/api/data');
  return response.data;
};

export const fetchOverview = async (): Promise<OverviewData> => {
  const response = await axios.get('/api/overview');
  return response.data;
};
