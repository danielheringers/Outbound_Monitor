"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { NFeData } from "./types";
import StatusBadges from "@/components/StatusBadge";

const playAlertSound = () => {
  const audio = new Audio('alert.mp3');
  audio.play();
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
};

export function NFeChart() {
  const [chartData, setChartData] = useState<NFeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndUpdateData = async () => {
      try {
        const response = await fetch('/api/metrics');
        if (!response.ok) {
          throw new Error('Falha ao buscar métricas');
        }
        const data = await response.json();
        const formattedData = data.nfe.map((item: NFeData) => ({
          ...item,
          period: formatDate(item.period)
        }));
        setChartData(formattedData);
        setIsLoading(false);

        const latestValue = formattedData[formattedData.length - 1]?.count || 0;
        if (latestValue < 150 && latestValue > 40) {
          playAlertSound();
        } else if (latestValue <= 40) {
          playAlertSound();
          playAlertSound();
        }
      } catch (err) {
        console.error('Erro ao carregar dados do gráfico:', err);
        setError('Falha ao carregar dados do gráfico');
        setIsLoading(false);
      }
    };

    fetchAndUpdateData();

    const interval = setInterval(fetchAndUpdateData, 900000);

    return () => clearInterval(interval);
  }, []);

  const chartConfig: ChartConfig = useMemo(
    () => ({
      NFe: {
        label: "NFe",
        theme: {
          light: "hsl(var(--chart-1))",
          dark: "hsl(var(--chart-1))",
        },
      },
    }),
    []
  );

  const memoizedChart = useMemo(() => {
    if (chartData.length === 0) return null;

    const maxCount = Math.max(...chartData.map(item => item.count));
    const minCount = Math.min(...chartData.map(item => item.count));
    const yDomain = [Math.max(0, minCount - 50), maxCount + 50];

    return (
      <ChartContainer config={chartConfig} className="h-[240px] w-full">
        <AreaChart
          data={chartData}
          margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--grid))" />
          <XAxis dataKey="period" />
          <YAxis domain={yDomain} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <ReferenceLine y={150} stroke="#fbbf24" strokeDasharray="3 3" />
          <ReferenceLine y={40} stroke="#f43f5e" strokeDasharray="3 3" />
          <defs>
            <linearGradient id="fillQuantidade" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--chart-1))"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--chart-1))"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="count"
            fill="url(#fillQuantidade)"
            fillOpacity={0.4}
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    );
  }, [chartData, chartConfig]);

  const notesToday = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.count, 0);
  }, [chartData]);

  const notesThisMonth = useMemo(() => {
    return notesToday;
  }, [notesToday]);

  if (isLoading) {
    return <Card className="w-full mt-4"><CardContent>Carregando...</CardContent></Card>;
  }

  if (error) {
    return <Card className="w-full mt-4"><CardContent>{error}</CardContent></Card>;
  }

  return (
    <Card className="w-full mt-4">
      <CardHeader className="flex flex-row w-full items-center justify-between">
        <CardTitle className="flex items-center text-[24px] h-full">NFe</CardTitle>
        <StatusBadges/>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4 p-2">
          <Card className="p-0">
            <CardContent className="flex p-2 flex-col items-center justify-center h-full">
              <div className="text-sm text-muted-foreground">Hoje</div>
              <div className="text-2xl font-bold">{notesToday}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex p-2 flex-col items-center justify-center h-full">
              <div className="text-sm text-muted-foreground">Mês</div>
              <div className="text-2xl font-bold">{notesThisMonth}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex p-2 flex-col items-center justify-center h-full">
              <div className="text-sm text-muted-foreground">Na Fila</div>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>
        {memoizedChart}
      </CardContent>
    </Card>
  );
}