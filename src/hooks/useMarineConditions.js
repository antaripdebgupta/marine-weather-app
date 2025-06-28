import { useEffect, useState } from 'react';
import { getUserLocation, fetchMarineData, fetchDailyData, fetchHourlyData } from '@/api';

function useConditions(fetchFn, defaultState) {
  const [conditions, setConditions] = useState(defaultState);

  useEffect(() => {
    const loadConditions = async () => {
      try {
        const { lat, long } = await getUserLocation();
        const data = await fetchFn(lat, long);
        if (data) setConditions(data);
      } catch (error) {
        console.error('Failed to load conditions:', error);
      }
    };

    loadConditions();
  }, [fetchFn]);

  return conditions;
}

export function useMarineConditions() {
  return useConditions(fetchMarineData, {
    wave_height: null,
    wave_direction: null,
    sea_surface_temperature: null,
    ocean_current_velocity: null,
    wind_wave_height: null,
    swell_wave_period: null,
  });
}

export function useDailyConditions() {
  return useConditions(fetchDailyData, {
    wave_height_max: null,
    wave_direction_dominant: null,
    swell_wave_period_max: null,
  });
}

export function useHourlyConditions() {
  return useConditions(fetchHourlyData, {
    wave_height: null,
    wind_wave_height: null,
    swell_wave_height: null,
    ocean_current_velocity: null,
  });
}
