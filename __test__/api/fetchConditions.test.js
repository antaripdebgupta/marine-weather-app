import { fetchMarineData, fetchDailyData, fetchHourlyData } from '@/api';
import { DEFAULT_LOCATION } from '@/api/constants';
import { formatTimeLabel } from '@/lib/formatUtils';

jest.mock('@/lib/formatUtils', () => ({
  formatTimeLabel: jest.fn((hour) => `${hour}:00`),
}));

describe('Marine API Functions', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchMarineData', () => {
    // TC-01: Success case
    it('return marine data when API call succeeds', async () => {
      const mockResponse = {
        current: {
          wave_height: 2.5,
          wave_direction: 180,
          sea_surface_temperature: 20,
          ocean_current_velocity: 1.2,
          wind_wave_height: 1.8,
          swell_wave_period: 8,
        },
      };

      global.fetch.mockResolvedValue({
        json: async () => mockResponse,
      });

      const result = await fetchMarineData(40.7128, -74.006);

      expect(result).toEqual({
        wave_height: 2.5,
        wave_direction: 180,
        sea_surface_temperature: 20,
        ocean_current_velocity: 1.2,
        wind_wave_height: 1.8,
        swell_wave_period: 8,
      });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('latitude=40.7128&longitude=-74.006')
      );
    });

    // TC-02: Null values trigger fallback
    it('DEFAULT_LOCATION when data has null values and not fallback', async () => {
      const mockResponseWithNull = {
        current: {
          wave_height: null,
          wave_direction: 180,
          sea_surface_temperature: 20,
          ocean_current_velocity: 1.2,
          wind_wave_height: 1.8,
          swell_wave_period: 8,
        },
      };

      const mockResponseDefault = {
        current: {
          wave_height: 2.0,
          wave_direction: 180,
          sea_surface_temperature: 20,
          ocean_current_velocity: 1.2,
          wind_wave_height: 1.8,
          swell_wave_period: 8,
        },
      };

      global.fetch
        .mockResolvedValueOnce({ json: async () => mockResponseWithNull })
        .mockResolvedValueOnce({ json: async () => mockResponseDefault });

      const result = await fetchMarineData(40.7128, -74.006, false);

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenLastCalledWith(
        expect.stringContaining(`latitude=${DEFAULT_LOCATION.lat}`)
      );
    });

    // TC-03: Null values but already fallback
    it('return data with nulls when already using fallback', async () => {
      const mockResponse = {
        current: {
          wave_height: null,
          wave_direction: 180,
          sea_surface_temperature: 20,
          ocean_current_velocity: 1.2,
          wind_wave_height: 1.8,
          swell_wave_period: 8,
        },
      };

      global.fetch.mockResolvedValue({
        json: async () => mockResponse,
      });

      const result = await fetchMarineData(40.7128, -74.006, true);

      expect(result.wave_height).toBeNull();
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // TC-04: API error
    it('should return null when API call fails', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      const result = await fetchMarineData(40.7128, -74.006);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith('API error:', expect.any(Error));
    });
  });

  describe('fetchDailyData', () => {
    // TC-05: Success case
    it('should return daily data when API call succeeds', async () => {
      const mockResponse = {
        daily: {
          wave_height_max: [3.2, 3.5, 3.8],
          wave_direction_dominant: [200, 210, 220],
          swell_wave_period_max: [9, 10, 11],
        },
      };

      global.fetch.mockResolvedValue({
        json: async () => mockResponse,
      });

      const result = await fetchDailyData(40.7128, -74.006);

      expect(result).toEqual({
        wave_height_max: 3.2,
        wave_direction_dominant: 200,
        swell_wave_period_max: 9,
      });
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('daily='));
    });

    // TC-06: Null values trigger fallback
    it('use DEFAULT_LOCATION when data has null values', async () => {
      const mockResponseWithNull = {
        daily: {
          wave_height_max: [null, 3.5, 3.8],
          wave_direction_dominant: [200, 210, 220],
          swell_wave_period_max: [9, 10, 11],
        },
      };

      const mockResponseDefault = {
        daily: {
          wave_height_max: [3.0, 3.5, 3.8],
          wave_direction_dominant: [200, 210, 220],
          swell_wave_period_max: [9, 10, 11],
        },
      };

      global.fetch
        .mockResolvedValueOnce({ json: async () => mockResponseWithNull })
        .mockResolvedValueOnce({ json: async () => mockResponseDefault });

      await fetchDailyData(40.7128, -74.006, false);

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    // TC-07: API error
    it('return null when API call fails', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      const result = await fetchDailyData(40.7128, -74.006);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('fetchHourlyData', () => {
    // TC-08: Success case
    it('return 12 hours of data in reverse order', async () => {
      const mockResponse = {
        hourly: {
          wave_height: Array(24)
            .fill(null)
            .map((_, i) => i * 0.1),
          wind_wave_height: Array(24)
            .fill(null)
            .map((_, i) => i * 0.05),
          swell_wave_height: Array(24)
            .fill(null)
            .map((_, i) => i * 0.08),
          ocean_current_velocity: Array(24)
            .fill(null)
            .map((_, i) => i * 0.02),
        },
      };

      global.fetch.mockResolvedValue({
        json: async () => mockResponse,
      });

      const result = await fetchHourlyData(40.7128, -74.006);

      expect(result).toHaveLength(12);
      expect(result[0]).toHaveProperty('time');
      expect(result[0]).toHaveProperty('waveHeight');
      expect(result[0]).toHaveProperty('windWave');
      expect(result[0]).toHaveProperty('swellWave');
      expect(result[0]).toHaveProperty('current');
      expect(formatTimeLabel).toHaveBeenCalled();
    });

    // TC-09: Null values trigger fallback
    it('use DEFAULT_LOCATION when data has null values', async () => {
      const mockResponseWithNull = {
        hourly: {
          wave_height: Array(24).fill(null),
          wind_wave_height: Array(24)
            .fill(null)
            .map((_, i) => i * 0.05),
          swell_wave_height: Array(24)
            .fill(null)
            .map((_, i) => i * 0.08),
          ocean_current_velocity: Array(24)
            .fill(null)
            .map((_, i) => i * 0.02),
        },
      };

      const mockResponseDefault = {
        hourly: {
          wave_height: Array(24)
            .fill(null)
            .map((_, i) => i * 0.1),
          wind_wave_height: Array(24)
            .fill(null)
            .map((_, i) => i * 0.05),
          swell_wave_height: Array(24)
            .fill(null)
            .map((_, i) => i * 0.08),
          ocean_current_velocity: Array(24)
            .fill(null)
            .map((_, i) => i * 0.02),
        },
      };

      global.fetch
        .mockResolvedValueOnce({ json: async () => mockResponseWithNull })
        .mockResolvedValueOnce({ json: async () => mockResponseDefault });

      await fetchHourlyData(40.7128, -74.006, false);

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    // TC-10: API error
    it('return empty array when API call fails', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      const result = await fetchHourlyData(40.7128, -74.006);

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });
});
