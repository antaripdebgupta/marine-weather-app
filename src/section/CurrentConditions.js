'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { currentConditions, dailySummary, tableHeaders } from '@/lib/data';
import {
  useMarineConditions,
  useDailyConditions,
  useHourlyConditions,
} from '@/hooks/useMarineConditions';

export default function CurrentConditions() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [submittedCoords, setSubmittedCoords] = useState(null);

  const {
    conditions,
    error: marineError,
    isLoading: marineLoading,
  } = useMarineConditions(submittedCoords);

  const {
    conditions: dailyConditions,
    error: dailyError,
    isLoading: dailyLoading,
  } = useDailyConditions(submittedCoords);

  const {
    conditions: hourlyData,
    error: hourlyError,
    isLoading: hourlyLoading,
  } = useHourlyConditions(submittedCoords);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!latitude || !longitude) {
      alert('Please enter both latitude and longitude');
      return;
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      alert('Please enter valid numbers for coordinates');
      return;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      alert(
        'Invalid coordinates: Latitude must be between -90 and 90, Longitude between -180 and 180'
      );
      return;
    }

    console.log('search lat,long: ', latitude, longitude);
    setSubmittedCoords({ lat, lon });
  };

  const error = marineError || dailyError || hourlyError;
  const loading = marineLoading || dailyLoading || hourlyLoading;
  return (
    <section className="min-h-screen pt-36 text-gray-900">
      <div className="p-4 max-w-5xl mx-auto space-y-12">
        {/* Search Location */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-4 items-center justify-center mb-8"
        >
          <input
            type="number"
            step="any"
            min="-90"
            max="90"
            placeholder="Latitude (-90 to 90)"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full md:w-56"
            required
          />
          <input
            type="number"
            step="any"
            min="-180"
            max="180"
            placeholder="Longitude (-180 to 180)"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full md:w-56"
            required
          />
          <button
            type="submit"
            className="bg-[#3399ff] text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Get Conditions'}
          </button>
        </form>

        {error && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Current Conditions */}
        {!loading && conditions && (
          <Section title="Current Conditions">
            <div className="grid md:grid-cols-3 gap-4">
              {currentConditions.map((item, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="text-sm text-center text-gray-500">
                      {item.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-lg font-bold">
                      {conditions[item.key] !== null && conditions[item.key] !== undefined
                        ? `${conditions[item.key]} ${item.unit}`
                        : '--'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>
        )}

        {/* Hourly Forecast */}
        {!loading && (
          <Section title="Hourly Forecast">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#3399ff] text-white">
                    {tableHeaders.map((header, i) => (
                      <TableHead key={i} className="text-white">
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hourlyData && hourlyData.length > 0 ? (
                    hourlyData.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>{row.time || '--'}</TableCell>
                        <TableCell>{row.waveHeight || '--'}</TableCell>
                        <TableCell>{row.windWave || '--'}</TableCell>
                        <TableCell>{row.swellWave || '--'}</TableCell>
                        <TableCell>{row.current || '--'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        {hourlyLoading ? 'Loading hourly forecast...' : 'No hourly data available'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Section>
        )}

        {/* Daily Summary */}
        {!loading && dailyConditions && (
          <Section title="Daily Summary">
            <div className="grid md:grid-cols-3 gap-4">
              {dailySummary.map((item, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="text-sm text-center text-gray-500">
                      {item.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-lg font-bold">
                      {dailyConditions[item.key] !== null && dailyConditions[item.key] !== undefined
                        ? `${dailyConditions[item.key]} ${item.unit}`
                        : '--'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>
        )}
      </div>
    </section>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-xl font-semibold border-b pb-2 mb-4">{title}</h2>
      {children}
    </div>
  );
}
