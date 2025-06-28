import {
  MARINE_API_BASE,
  WEATHER_PARAMS,
  DEFAULT_LOCATION,
  DAILY_PARAMS,
  HOURLY_PARAMS,
} from './constants';

import { formatTimeLabel } from '@/lib/formatUtils';

const fetchData = async (url, dataExtractor, fallback, fallbackFn) => {
  try {
    const response = await fetch(url);
    const result = await response.json();
    const data = dataExtractor(result);

    const hasNull = Array.isArray(data)
      ? data.some((item) => Object.values(item).some((val) => val == null))
      : Object.values(data).some((val) => val == null);

    if (hasNull && !fallback) {
      return await fallbackFn(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.long, true);
    }

    return data;
  } catch (error) {
    console.error('API error:', error);
    return Array.isArray(data) ? [] : null;
  }
};

export const fetchMarineData = async (lat, long, fallback = false) => {
  const url = `${MARINE_API_BASE}?latitude=${lat}&longitude=${long}&current=${WEATHER_PARAMS}`;

  const extractor = (result) => ({
    wave_height: result.current?.wave_height,
    wave_direction: result.current?.wave_direction,
    sea_surface_temperature: result.current?.sea_surface_temperature,
    ocean_current_velocity: result.current?.ocean_current_velocity,
    wind_wave_height: result.current?.wind_wave_height,
    swell_wave_period: result.current?.swell_wave_period,
  });

  return fetchData(url, extractor, fallback, fetchMarineData);
};

export const fetchDailyData = async (lat, long, fallback = false) => {
  const url = `${MARINE_API_BASE}?latitude=${lat}&longitude=${long}&daily=${DAILY_PARAMS}`;

  const extractor = (result) => ({
    wave_height_max: result.daily?.wave_height_max?.[0],
    wave_direction_dominant: result.daily?.wave_direction_dominant?.[0],
    swell_wave_period_max: result.daily?.swell_wave_period_max?.[0],
  });

  return fetchData(url, extractor, fallback, fetchDailyData);
};

export const fetchHourlyData = async (lat, long, fallback = false) => {
  const url = `${MARINE_API_BASE}?latitude=${lat}&longitude=${long}&hourly=${HOURLY_PARAMS}`;

  const extractor = (result) => {
    const now = new Date();
    const currentHour = now.getHours();
    const dataArray = [];

    for (let i = currentHour - 11; i <= currentHour; i++) {
      const index = i < 0 ? 24 + i : i;

      dataArray.push({
        time: formatTimeLabel(index),
        waveHeight: result.hourly?.wave_height?.[index],
        windWave: result.hourly?.wind_wave_height?.[index],
        swellWave: result.hourly?.swell_wave_height?.[index],
        current: result.hourly?.ocean_current_velocity?.[index],
      });
    }

    return dataArray.reverse();
  };

  return fetchData(url, extractor, fallback, fetchHourlyData);
};
