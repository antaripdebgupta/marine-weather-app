export const currentConditions = [
  { label: 'Wave Height', unit: 'm' },
  { label: 'Wave Direction', unit: '°' },
  { label: 'Sea Surface Temp', unit: '°C' },
  { label: 'Ocean Current', unit: 'km/h' },
  { label: 'Wind Wave Height', unit: 'm' },
  { label: 'Swell Wave Period', unit: 's' },
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
