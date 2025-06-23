import { DEFAULT_LOCATION } from './constants';

export const getUserLocation = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported. Using default location.');
      return resolve(DEFAULT_LOCATION);
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        //const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        //console.log(`Latitude: ${lat}, Longitude: ${long}`);
        resolve({ lat, long });
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        resolve(DEFAULT_LOCATION);
      }
    );
  });
};
