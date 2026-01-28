'use client';
 
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SimpleLineChartProps {
  data?: { name: string; value: number }[];
}

export function SimpleLineChart({ data = [] }: SimpleLineChartProps) {
  // If no data, show a placeholder or empty state message 
  if (data.length === 0) {
      return (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm border border-dashed border-border rounded-lg">
              No contribution history yet
          </div>
      );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0 0)" />
        <XAxis 
            dataKey="name" 
            stroke="oklch(0.7 0 0)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: 'oklch(0.7 0 0)' }}
        />
        <YAxis 
            stroke="oklch(0.7 0 0)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: 'oklch(0.7 0 0)' }}
            tickFormatter={(value) => `${value}`} 
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'oklch(0.18 0 0)',
            border: '1px solid oklch(0.28 0 0)',
            borderRadius: '0.5rem',
            color: 'oklch(0.95 0 0)',
          }}
          itemStyle={{ color: 'oklch(0.6 0.3 290)' }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="oklch(0.6 0.3 290)"
          dot={{ fill: 'oklch(0.6 0.3 290)' }}
          strokeWidth={2}
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
