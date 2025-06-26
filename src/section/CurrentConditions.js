'use client';

import React from 'react';
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
} from '@/lib/useMarineConditions';

export default function CurrentConditions() {
  const conditions = useMarineConditions();
  const dailyConditions = useDailyConditions();
  const hourlyData = useHourlyConditions();

  return (
    <section className="min-h-screen pt-36 text-gray-900">
      <div className="p-4 max-w-5xl mx-auto space-y-12">
        {/* Current Conditions */}
        <Section title="Current Conditions">
          <div className="grid md:grid-cols-3 gap-4">
            {currentConditions.map((item, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-sm text-center text-gray-500">{item.label}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-lg font-bold">
                    {conditions[item.key] !== null ? conditions[item.key] : '--'}{' '}
                    <span className="text-sm text-gray-600">{item.unit}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        {/* Hourly Forecast */}
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
                {hourlyData.length > 0 ? (
                  hourlyData.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.time}</TableCell>
                      <TableCell>{row.waveHeight}</TableCell>
                      <TableCell>{row.windWave}</TableCell>
                      <TableCell>{row.swellWave}</TableCell>
                      <TableCell>{row.current}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      Loading hourly forecast...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Section>

        {/* Daily Summary */}
        <Section title="Daily Summary">
          <div className="grid md:grid-cols-3 gap-4">
            {dailySummary.map((item, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-sm text-center text-gray-500">{item.label}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-lg font-bold">
                    {dailyConditions[item.key] !== null ? dailyConditions[item.key] : '--'}{' '}
                    <span className="text-sm text-gray-600">{item.unit}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
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
