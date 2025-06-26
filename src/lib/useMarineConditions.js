import { useEffect, useState } from 'react';
import { getUserLocation, fetchMarineData, fetchDailyData, fetchHourlyData } from '@/api';

export function useMarineConditions() {
  const [conditions, setConditions] = useState({
    wave_height: null,
    wave_direction: null,
    sea_surface_temperature: null,
    ocean_current_velocity: null,
    wind_wave_height: null,
    swell_wave_period: null,
  });

  useEffect(() => {
    const loadConditions = async () => {
      const { lat, long } = await getUserLocation();
      const data = await fetchMarineData(lat, long);
      if (data) setConditions(data);
      //console.log(data);
    };

    loadConditions();
  }, []);

  return conditions;
}

export function useDailyConditions() {
  const [conditions, setConditions] = useState({
    wave_height_max: null,
    wave_direction_dominant: null,
    swell_wave_period_max: null,
  });

  useEffect(() => {
    const loadConditions = async () => {
      const { lat, long } = await getUserLocation();
      const data = await fetchDailyData(lat, long);
      if (data) setConditions(data);
    };

    loadConditions();
  }, []);

  return conditions;
}

export function useHourlyConditions() {
  const [conditions, setConditions] = useState({
    wave_height: null,
    wind_wave_height: null,
    swell_wave_height: null,
    ocean_current_velocity: null,
  });

  useEffect(() => {
    const loadConditions = async () => {
      const { lat, long } = await getUserLocation();
      const data = await fetchHourlyData(lat, long);
      if (data) setConditions(data);
    };

    loadConditions();
  }, []);

  return conditions;
}
