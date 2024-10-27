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
import NFSERPSStatusBadge from "@/components/QueueStatusBadge/NFSERPSStatusBadge";

export function NFSeChart() {
  const { nfseData, queueData } = useMonitor();

  const chartConfig = {
    count: {
      label: "NFSe",
      theme: {
        light: "hsl(var(--chart-1))",
        dark: "hsl(var(--chart-1))",
      },
    },
  };

  const notesToday = nfseData.reduce((sum, item) => sum + item.count, 0);
  const notesThisMonth = notesToday;
  const nfseEmit = queueData.nfseEmit?.totalMessagesReady || 0;
  const nfseCancel = queueData.nfseCancel?.totalMessagesReady || 0;
  const nfseQueryNfse = queueData.nfseQueryNfse?.totalMessagesReady || 0;
  const nfseQueryRpsProtocol =
    queueData.nfseQueryRpsProtocol?.totalMessagesReady || 0;
  const RPS = queueData.RPS?.totalMessagesReady || 0;
  const queueCount = nfseEmit + nfseCancel + nfseQueryNfse + nfseQueryRpsProtocol + RPS || 0;

  const maxCount = Math.max(...nfseData.map((item) => item.count));
  const minCount = Math.min(...nfseData.map((item) => item.count));
  const yDomain = [Math.max(0, minCount - 50), maxCount + 50];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row w-full items-center justify-between gap-6">
        <CardTitle className="flex items-center self-end text-[24px] h-full">
          NFSe
        </CardTitle>
        <NFSERPSStatusBadge />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4 p-2">
          <Card className="rounded-md">
            <CardContent className="flex p-2 items-center justify-between h-full">
              <div className="text-md text-muted-foreground w-full">Hoje</div>
              <Separator orientation="vertical" />
              <div className="text-2xl font-bold pl-4 pr-2">{notesToday}</div>
            </CardContent>
          </Card>
          <Card className="rounded-md">
            <CardContent className="flex p-2 items-center justify-between h-full">
              <div className="text-md text-muted-foreground w-full">Mês</div>
              <Separator orientation="vertical" />
              <div className="text-2xl font-bold pl-4 pr-2">
                {notesThisMonth}
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-md">
            <CardContent className="flex p-2 items-center justify-between h-full">
              <div className="text-md text-muted-foreground w-full">
                Na Fila
              </div>
              <Separator orientation="vertical" />
              <div className="text-2xl font-bold pl-4 pr-2">{queueCount}</div>
            </CardContent>
          </Card>
        </div>
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
          <AreaChart
            data={nfseData}
            margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--grid))" />
            <XAxis dataKey="period" />
            <YAxis domain={yDomain} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
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
