export const DEFAULT_LOCATION = {
  lat: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LAT),
  long: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LONG),
};

export const MARINE_API_BASE = process.env.NEXT_PUBLIC_MARINE_API_BASE;

export const WEATHER_PARAMS = [
  'wave_height',
  'wave_direction',
  'sea_surface_temperature',
  'wind_wave_height',
  'swell_wave_period',
  'ocean_current_velocity',
].join(',');
