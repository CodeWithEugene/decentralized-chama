'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', contributions: 1200 },
  { month: 'Feb', contributions: 1900 },
  { month: 'Mar', contributions: 1500 },
  { month: 'Apr', contributions: 2200 },
  { month: 'May', contributions: 2800 },
  { month: 'Jun', contributions: 2400 },
];

export function SimpleLineChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0 0)" />
        <XAxis dataKey="month" stroke="oklch(0.7 0 0)" />
        <YAxis stroke="oklch(0.7 0 0)" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'oklch(0.18 0 0)',
            border: '1px solid oklch(0.28 0 0)',
            borderRadius: '0.5rem',
            color: 'oklch(0.95 0 0)',
          }}
        />
        <Line
          type="monotone"
          dataKey="contributions"
          stroke="oklch(0.6 0.3 290)"
          dot={{ fill: 'oklch(0.6 0.3 290)' }}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
