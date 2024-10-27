"use client";

import { useMonitor } from "@/context/MonitorContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { Separator } from "@/components/ui/separator";
import QueueStatusBadges from "@/components/QueueStatusBadge";
import { formatNumber } from "@/lib/utils";
import { useEffect, useState } from "react";

export function NFeChart() {
  const { nfeData, queueData } = useMonitor();
  const [queueCount, setQueueCount] = useState(0);

  const chartConfig = {
    count: {
      label: "NFe",
      theme: {
        light: "hsl(var(--chart-1))",
        dark: "hsl(var(--chart-1))",
      },
    },
  };

  const notesToday = nfeData.reduce((sum, item) => sum + item.count, 0);
  const notesThisMonth = notesToday;

  useEffect(() => {
    const newQueueCount = queueData.nfeEmit?.totalMessagesReady || 0;
    setQueueCount(newQueueCount);
  }, [queueData]);

  const maxCount = Math.max(...nfeData.map((item) => item.count));
  const minCount = Math.min(...nfeData.map((item) => item.count));
  const yDomain = [Math.max(0, minCount - 50), maxCount + 50];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col w-full items-center justify-between gap-2 sm:gap-6 lg:flex-row">
        <CardTitle className="flex items-center text-lg md:text-md lg:text-2xl h-full">
          NFe
        </CardTitle>
        <QueueStatusBadges />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 mb-4 p-2">
          <Card className="rounded-md">
            <CardContent className="flex p-2 items-center justify-between h-full">
              <div className="text-sm sm:text-md text-muted-foreground w-full">Hoje</div>
              <Separator orientation="vertical" className="mx-2" />
              <div className="text-lg sm:text-md md:text-lg font-bold pl-2 sm:pl-4 pr-2">
                {formatNumber(notesToday)}
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-md">
            <CardContent className="flex p-2 items-center justify-between h-full">
              <div className="text-sm sm:text-md text-muted-foreground w-full">Mês</div>
              <Separator orientation="vertical" className="mx-2" />
              <div className="text-lg sm:text-md md:text-lg font-bold pl-2 sm:pl-4 pr-2">
                {formatNumber(notesThisMonth)}
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-md">
            <CardContent className="flex p-2 items-center justify-between h-full">
              <div className="text-sm sm:text-md text-muted-foreground w-full">
                Na Fila
              </div>
              <Separator orientation="vertical" className="mx-2" />
              <div className="text-lg sm:text-md md:text-lg font-bold pl-2 sm:pl-4 pr-2">
                {formatNumber(queueCount)}
              </div>
            </CardContent>
          </Card>
        </div>
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
          <AreaChart
            data={nfeData}
            margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--grid))" />
            <XAxis dataKey="period" />
            <YAxis domain={yDomain} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--color-count)"
              fill="var(--color-count)"
              fillOpacity={0.1}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}