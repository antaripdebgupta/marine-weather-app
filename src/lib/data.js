export const currentConditions = [
  { label: 'Wave Height', key: 'wave_height', unit: 'm' },
  { label: 'Wave Direction', key: 'wave_direction', unit: '°' },
  { label: 'Sea Surface Temp', key: 'sea_surface_temperature', unit: '°C' },
  { label: 'Ocean Current Velocity', key: 'ocean_current_velocity', unit: 'm/s' },
  { label: 'Wind Wave Height', key: 'wind_wave_height', unit: 'm' },
  { label: 'Swell Wave Period', key: 'swell_wave_period', unit: 's' },
];

export const dailySummary = [
  { label: 'Max Wave Height', unit: 'm' },
  { label: 'Dominant Wave Direction', unit: '°' },
  { label: 'Max Swell Period', unit: 's' },
];

export const tableHeaders = [
  'Time',
  'Wave Height (m)',
  'Wind Wave (m)',
  'Swell Wave (m)',
  'Current (km/h)',
];

export const hourlyData = [
  {
    time: '12:00',
    waveHeight: '--',
    windWave: '--',
    swellWave: '--',
    current: '--',
  },
];
