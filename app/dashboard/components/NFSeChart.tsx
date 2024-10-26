"use client"

import { useMonitor } from "@/context/MonitorContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ReferenceLine } from "recharts"

export function NFSeChart() {
  const { nfseData, isLoading } = useMonitor()

  const chartConfig = {
    NFSe: {
      label: "NFSe",
      theme: {
        light: "hsl(var(--chart-1))",
        dark: "hsl(var(--chart-1))",
      },
    },
  }

  if (isLoading) {
    return <Card className="w-full mt-4"><CardContent>Carregando...</CardContent></Card>
  }

  const notesToday = nfseData.reduce((sum, item) => sum + item.count, 0)
  const notesThisMonth = notesToday // Assuming the data is for today only

  const maxCount = Math.max(...nfseData.map(item => item.count))
  const minCount = Math.min(...nfseData.map(item => item.count))
  const yDomain = [Math.max(0, minCount - 50), maxCount + 50]

  return (
    <Card className="w-full mt-4">
      <CardHeader className="flex flex-row w-full items-center justify-between gap-6">
        <CardTitle className="flex items-center self-end text-[24px] h-full">NFSe</CardTitle>
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
              <div className="text-2xl font-bold">21.247</div>
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
      </CardContent>
    </Card>
  )
}