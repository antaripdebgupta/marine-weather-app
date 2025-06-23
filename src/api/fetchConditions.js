import { MARINE_API_BASE, WEATHER_PARAMS, DEFAULT_LOCATION } from './constants';

export const fetchMarineData = async (lat, long, fallback = false) => {
  try {
    const url = `${MARINE_API_BASE}?latitude=${lat}&longitude=${long}&current=${WEATHER_PARAMS}`;
    const response = await fetch(url);
    const result = await response.json();

    const data = {
      wave_height: result.current?.wave_height,
      wave_direction: result.current?.wave_direction,
      sea_surface_temperature: result.current?.sea_surface_temperature,
      ocean_current_velocity: result.current?.ocean_current_velocity,
      wind_wave_height: result.current?.wind_wave_height,
      swell_wave_period: result.current?.swell_wave_period,
    };

    const hasNull = Object.values(data).some((val) => val == null);

    if (hasNull && !fallback) {
      //console.warn('Some data is null — retrying with default location...');
      return await fetchMarineData(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.long, true);
    }

    return data;
  } catch (error) {
    console.error('API error:', error);
    return null;
  }
};
