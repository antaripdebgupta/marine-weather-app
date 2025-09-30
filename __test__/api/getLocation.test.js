import { getUserLocation } from '@/api/getLocation';
import { DEFAULT_LOCATION } from '@/api/constants';

describe('getUserLocation', () => {
  let mockGeolocation;

  beforeEach(() => {
    mockGeolocation = { getCurrentPosition: jest.fn() };
    console.warn = jest.fn();
  });

  // TC-01: Success case
  it('succeeds', async () => {
    global.navigator.geolocation = mockGeolocation;

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({ coords: { latitude: 40.7128, longitude: -74.006 } });
    });

    const result = await getUserLocation();

    expect(result).toEqual({ lat: 40.7128, long: -74.006 });
  });

  // TC-02: Error case
  it('return DEFAULT_LOCATION when geolocation fails', async () => {
    global.navigator.geolocation = mockGeolocation;

    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error({ message: 'User denied' });
    });

    const result = await getUserLocation();

    expect(result).toEqual(DEFAULT_LOCATION);
    expect(console.warn).toHaveBeenCalledWith('Geolocation error:', 'User denied');
  });

  // TC-03: Not supported case
  it('return DEFAULT_LOCATION when geolocation not supported', async () => {
    global.navigator.geolocation = undefined;

    const result = await getUserLocation();

    expect(result).toEqual(DEFAULT_LOCATION);
    expect(console.warn).toHaveBeenCalledWith('Geolocation not supported. Using default location.');
  });
});
