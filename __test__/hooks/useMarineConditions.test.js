import { renderHook, waitFor } from '@testing-library/react';
import {
  useMarineConditions,
  useHourlyConditions,
  useDailyConditions,
} from '@/hooks/useMarineConditions';
import { getUserLocation, fetchMarineData, fetchDailyData, fetchHourlyData } from '@/api';

jest.mock('@/api', () => ({
  getUserLocation: jest.fn(),
  fetchMarineData: jest.fn(),
  fetchDailyData: jest.fn(),
  fetchHourlyData: jest.fn(),
}));

describe('Conditions Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  describe('useMarineConditions', () => {
    const mockMarineData = {
      wave_height: 2.5,
      wave_direction: 180,
      sea_surface_temperature: 20,
      ocean_current_velocity: 1.2,
      wind_wave_height: 1.8,
      swell_wave_period: 8,
    };

    // TC-01: Success with coords
    it('should fetch marine data with provided coordinates', async () => {
      fetchMarineData.mockResolvedValue(mockMarineData);

      const { result } = renderHook(() => useMarineConditions({ lat: 40.7128, lon: -74.006 }));

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.conditions).toEqual(mockMarineData);
      expect(result.current.error).toBeNull();
      expect(fetchMarineData).toHaveBeenCalledWith(40.7128, -74.006);
    });

    // TC-02: Coords return null, use fallback
    it('should use user location when coords return invalid data', async () => {
      fetchMarineData.mockResolvedValueOnce(null).mockResolvedValueOnce(mockMarineData);
      getUserLocation.mockResolvedValue({ lat: 22.5726, long: 88.3639 });

      const { result } = renderHook(() => useMarineConditions({ lat: 40.7128, lon: -74.006 }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.conditions).toEqual(mockMarineData);
      expect(result.current.error).toBe(
        'No data for submitted coordinates. Showing default location data.'
      );
      expect(getUserLocation).toHaveBeenCalled();
      expect(fetchMarineData).toHaveBeenCalledWith(22.5726, 88.3639, true);
    });

    // TC-03: No coords provided
    it('should use user location when no coords provided', async () => {
      getUserLocation.mockResolvedValue({ lat: 22.5726, long: 88.3639 });
      fetchMarineData.mockResolvedValue(mockMarineData);

      const { result } = renderHook(() => useMarineConditions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.conditions).toEqual(mockMarineData);
      expect(result.current.error).toBeNull();
      expect(getUserLocation).toHaveBeenCalled();
      expect(fetchMarineData).toHaveBeenCalledWith(22.5726, 88.3639);
    });

    // TC-04: Fetch fails
    it('should set error state when fetch fails', async () => {
      getUserLocation.mockResolvedValue({ lat: 22.5726, long: 88.3639 });
      fetchMarineData.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useMarineConditions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.conditions).toEqual({
        wave_height: null,
        wave_direction: null,
        sea_surface_temperature: null,
        ocean_current_velocity: null,
        wind_wave_height: null,
        swell_wave_period: null,
      });
    });
  });

  describe('useHourlyConditions', () => {
    const mockHourlyData = [
      { time: '10:00', waveHeight: 2.5, windWave: 1.5, swellWave: 1.0, current: 0.5 },
      { time: '11:00', waveHeight: 2.6, windWave: 1.6, swellWave: 1.1, current: 0.6 },
    ];

    // TC-05: Success with coords
    it('should fetch hourly data with provided coordinates', async () => {
      fetchHourlyData.mockResolvedValue(mockHourlyData);

      const { result } = renderHook(() => useHourlyConditions({ lat: 40.7128, lon: -74.006 }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.conditions).toEqual(mockHourlyData);
      expect(result.current.error).toBeNull();
      expect(fetchHourlyData).toHaveBeenCalledWith(40.7128, -74.006);
    });

    // TC-06: Fetch fails
    it('should set error state when fetch fails', async () => {
      getUserLocation.mockResolvedValue({ lat: 22.5726, long: 88.3639 });
      fetchHourlyData.mockRejectedValue(new Error('API error'));

      const { result } = renderHook(() => useHourlyConditions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('API error');
      expect(result.current.conditions).toEqual({
        wave_height: null,
        wind_wave_height: null,
        swell_wave_height: null,
        ocean_current_velocity: null,
      });
    });
  });

  describe('useDailyConditions', () => {
    const mockDailyData = {
      wave_height_max: 3.2,
      wave_direction_dominant: 200,
      swell_wave_period_max: 9,
    };

    // TC-07: Success with coords
    it('should fetch daily data with provided coordinates', async () => {
      fetchDailyData.mockResolvedValue(mockDailyData);

      const { result } = renderHook(() => useDailyConditions({ lat: 40.7128, lon: -74.006 }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.conditions).toEqual(mockDailyData);
      expect(result.current.error).toBeNull();
      expect(fetchDailyData).toHaveBeenCalledWith(40.7128, -74.006);
    });

    // TC-08: Fetch fails
    it('should set error state when fetch fails', async () => {
      getUserLocation.mockResolvedValue({ lat: 22.5726, long: 88.3639 });
      fetchDailyData.mockRejectedValue(new Error('Failed to fetch'));

      const { result } = renderHook(() => useDailyConditions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('Failed to fetch');
      expect(result.current.conditions).toEqual({
        wave_height_max: null,
        wave_direction_dominant: null,
        swell_wave_period_max: null,
      });
    });
  });
});
