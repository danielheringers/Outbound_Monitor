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
import { useMonitor } from "@/context/MonitorContext";

const categorizeResponseTime = (meanTimeInSeconds: number): string => {
  if (meanTimeInSeconds < 100) {
    return "0.00";
  } else if (meanTimeInSeconds < 250) {
    return "0.25";
  } else if (meanTimeInSeconds < 500) {
    return "0.50";
  } else if (meanTimeInSeconds < 750) {
    return "0.75";
  } else {
    return "1.00";
  }
};

interface NfeDataItem {
  period: string;
  meanResponseTime: number;
}

interface ChartDataItem {
  time: string;
  responseTime: number;
}

const generateChartData = (nfeData: NfeDataItem[]): ChartDataItem[] => {
  return nfeData.map((item) => ({
    time: item.period,
    responseTime: parseFloat(categorizeResponseTime(item.meanResponseTime)),
  }));
};

const responseCategories = [
  { value: 1.0, label: "Lento", color: "#FF4136" },
  { value: 0.75, label: "Aceitável", color: "#FF851B" },
  { value: 0.5, label: "Bom", color: "#0074D9" },
  { value: 0.25, label: "Excelente", color: "#2ECC40" },
  { value: 0.0, label: "Dream", color: "#802ecc" },
];

export function ResponseTimeChart() {
  const { nfeData } = useMonitor();
  const [chartData, setChartData] = useState(() =>
    nfeData ? generateChartData(nfeData) : []
  );

  useEffect(() => {
    if (nfeData) {
      setChartData(generateChartData(nfeData));
    }
  }, [nfeData]);

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
    if (!payload) return null;
    const category = responseCategories.find(
      (cat) => cat.value === payload.value
    );
    return (
      <g transform={`translate(${x || 0},${y || 0})`}>
        <text
          x={-5}
          y={0}
          dy={4}
          textAnchor="end"
          fill={category?.color}
          fontSize={12}
        >
          {category?.label}
        </text>
      </g>
    );
  };
  console.log("nfeData:", nfeData);
  console.log("chartData:", chartData);

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
              <XAxis dataKey="time" interval={3} tick={{ fontSize: 12 }} />
              <YAxis
                domain={[0.1, 1]}
                ticks={[0, 0.25, 0.5, 0.75, 1.0]}
                tick={
                  <CustomYAxisTick
                    x={undefined}
                    y={undefined}
                    payload={undefined}
                  />
                }
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
