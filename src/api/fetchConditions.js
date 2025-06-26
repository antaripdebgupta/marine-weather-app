import {
  MARINE_API_BASE,
  WEATHER_PARAMS,
  DEFAULT_LOCATION,
  DAILY_PARAMS,
  HOURLY_PARAMS,
} from './constants';

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

export const fetchDailyData = async (lat, long, fallback = false) => {
  try {
    const url = `${MARINE_API_BASE}?latitude=${lat}&longitude=${long}&daily=${DAILY_PARAMS}`;
    const response = await fetch(url);
    const result = await response.json();

    const data = {
      wave_height_max: result.daily?.wave_height_max?.[0],
      wave_direction_dominant: result.daily?.wave_direction_dominant?.[0],
      swell_wave_period_max: result.daily?.swell_wave_period_max?.[0],
    };

    const hasNull = Object.values(data).some((val) => val == null);

    if (hasNull && !fallback) {
      console.warn('Some data is null — retrying with default location...');
      return await fetchDailyData(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.long, true);
    }

    return data;
  } catch (error) {
    console.error('API error:', error);
    return null;
  }
};

export const fetchHourlyData = async (lat, long, fallback = false) => {
  try {
    const url = `${MARINE_API_BASE}?latitude=${lat}&longitude=${long}&hourly=${HOURLY_PARAMS}`;
    const response = await fetch(url);
    const result = await response.json();

    const now = new Date();
    const currentHour = now.getHours();

    const dataArray = [];

    for (let i = currentHour - 11; i <= currentHour; i++) {
      const index = i < 0 ? 24 + i : i;

      // Format time with AM/PM
      const hour12 = index % 12 === 0 ? 12 : index % 12;
      const ampm = index < 12 ? 'AM' : 'PM';
      const timeLabel = `${hour12}:00 ${ampm}`;

      dataArray.push({
        time: timeLabel,
        waveHeight: result.hourly?.wave_height?.[index],
        windWave: result.hourly?.wind_wave_height?.[index],
        swellWave: result.hourly?.swell_wave_height?.[index],
        current: result.hourly?.ocean_current_velocity?.[index],
      });
    }

    const hasNull = dataArray.some((item) => Object.values(item).some((val) => val == null));

    if (hasNull && !fallback) {
      return await fetchHourlyData(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.long, true);
    }

    return dataArray.reverse(); // Reverse so latest hour comes first
  } catch (error) {
    console.error('API error:', error);
    return [];
  }
};
