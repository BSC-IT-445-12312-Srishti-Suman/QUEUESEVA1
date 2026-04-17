import { normalizeString } from "../utils/string-utils";

export interface CityResponse {
  error: boolean;
  msg: string;
  data: string[];
}

/**
 * Service for location-related API calls.
 */
export const LocationService = {
  /**
   * Fetches cities for a given state in India.
   * Normalizes city names to remove diacritics.
   */
  async fetchCitiesByState(state: string): Promise<string[]> {
    if (!state) return [];
    
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: 'India', state })
      });
      
      const data: CityResponse = await response.json();
      
      if (data && !data.error) {
        // Normalize city names: remove diacritics (accents) for better formatting and easier search
        const normalizedCities = data.data.map((city: string) => normalizeString(city));
        
        // Remove duplicates and sort alphabetically
        return Array.from(new Set(normalizedCities)).sort();
      }
      
      return [];
    } catch (error) {
      console.error('Error in LocationService.fetchCitiesByState:', error);
      throw error;
    }
  }
};
