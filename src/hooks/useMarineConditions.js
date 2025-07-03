import { useEffect, useState } from 'react';
import { getUserLocation, fetchMarineData, fetchDailyData, fetchHourlyData } from '@/api';

function useConditions(fetchFn, defaultState, coords = null) {
  const [conditions, setConditions] = useState(defaultState);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConditions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let data;
        let usedDefault = false;

        if (coords?.lat && coords?.lon) {
          data = await fetchFn(coords.lat, coords.lon);

          const isInvalid =
            !data ||
            (typeof data === 'object' &&
              Object.values(data).some((val) => val == null || val === undefined));

          if (isInvalid) {
            const { lat, long } = await getUserLocation();
            data = await fetchFn(lat, long, true);
            usedDefault = true;
          }
        } else {
          const { lat, long } = await getUserLocation();
          data = await fetchFn(lat, long);
        }

        if (!data) throw new Error('No data available');

        setConditions(data);

        if (usedDefault) {
          setError('No data for submitted coordinates. Showing default location data.');
        }
      } catch (error) {
        console.error('Failed to load conditions:', error);
        setError(error.message);
        setConditions(defaultState);
      } finally {
        setIsLoading(false);
      }
    };

    loadConditions();
  }, [fetchFn, coords?.lat, coords?.lon]);

  return { conditions, error, isLoading };
}

export function useMarineConditions(coords = null) {
  return useConditions(
    fetchMarineData,
    {
      wave_height: null,
      wave_direction: null,
      sea_surface_temperature: null,
      ocean_current_velocity: null,
      wind_wave_height: null,
      swell_wave_period: null,
    },
    coords
  );
}

export function useHourlyConditions(coords = null) {
  return useConditions(
    fetchHourlyData,
    {
      wave_height: null,
      wind_wave_height: null,
      swell_wave_height: null,
      ocean_current_velocity: null,
    },
    coords
  );
}

export function useDailyConditions(coords = null) {
  return useConditions(
    fetchDailyData,
    {
      wave_height_max: null,
      wave_direction_dominant: null,
      swell_wave_period_max: null,
    },
    coords
  );
}
