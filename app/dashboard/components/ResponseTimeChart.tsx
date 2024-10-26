"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const categorizeResponseTime = (meanTimeInSeconds: number): string => {
  if (meanTimeInSeconds < 0.25) {
    return '0.25';
  } else if (meanTimeInSeconds < 0.5) {
    return '0.50';
  } else if (meanTimeInSeconds < 0.8) {
    return '0.80';
  } else {
    return '1.00';
  }
};

const generateChartData = () => {
  const data = [];
  const now = new Date();
  for (let i = 0; i < 32; i++) {
    const time = new Date(now.getTime() - (31 - i) * 15 * 60000);
    const rawResponseTime = Math.random() * (0.49 - 0.20) + 0.20;
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      responseTime: parseFloat(categorizeResponseTime(rawResponseTime)),
    });
  }
  return data;
};


const responseCategories = [
  { value: 1.00, label: "Lento", color: "#FF4136" },
  { value: 0.80, label: "Aceitável", color: "#FF851B" },
  { value: 0.50, label: "Bom", color: "#0074D9" },
  { value: 0.25, label: "Excelente", color: "#2ECC40" },
  { value: 0.00, label: "Perfect", color: "#2ecc400" },
];

export function ResponseTimeChart() {
  const [chartData, setChartData] = useState(() => generateChartData());

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(generateChartData());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const chartConfig: ChartConfig = useMemo(
    () => ({
      responseTime: {
        label: "Tempo de Resposta",
        theme: {
          light: "hsl(var(--chart-1))",
          dark: "hsl(var(--chart-1))",
        },
      },
    }),
    []
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomYAxisTick = ({ x, y, payload }: any) => {
    const category = responseCategories.find(cat => cat.value === payload.value);
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={-5} y={0} dy={4} textAnchor="end" fill={category?.color} fontSize={12}>
          {category?.label}
        </text>
      </g>
    );
  };

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="text-[24px]">Tempo de Resposta</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--grid))" />
              <XAxis
                dataKey="time"
                interval={3}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                domain={[0.10, 1.10]}
                ticks={[0.25, 0.50, 0.80, 1.00]}
                tick={<CustomYAxisTick x={undefined} y={undefined} payload={undefined} />}
                axisLine={false}
                tickLine={false}
              />
              {responseCategories.map((category) => (
                <ReferenceLine
                  key={category.label}
                  y={category.value}
                  stroke={category.color}
                  strokeDasharray="3 3"
                />
              ))}
              <Line
                type="linear"
                dataKey="responseTime"
                stroke="#8264d4"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}