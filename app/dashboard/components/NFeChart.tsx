'use client'

import { useMonitor } from "@/context/MonitorContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"
import { Separator } from "@/components/ui/separator"
import QueueStatusBadges from "@/components/QueueStatusBadge"
import { formatNumber } from "@/lib/utils"

export function NFeChart() {
  const { nfeData, queueData } = useMonitor()

  const chartConfig = {
    count: {
      label: "NFe",
      theme: {
        light: "hsl(var(--chart-1))",
        dark: "hsl(var(--chart-1))",
      },
    },
  }

  const notesToday = nfeData.reduce((sum, item) => sum + item.count, 0)
  const notesThisMonth = notesToday
  const queueCount = queueData.nfeEmit?.totalMessagesReady || 0

  const maxCount = Math.max(...nfeData.map(item => item.count))
  const minCount = Math.min(...nfeData.map(item => item.count))
  const yDomain = [Math.max(0, minCount - 50), maxCount + 50]

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row w-full items-center justify-between">
        <CardTitle className="flex items-center text-[24px] h-full">NFe</CardTitle>
        <QueueStatusBadges />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4 p-2">
          <Card className="rounded-md">
            <CardContent className="flex p-2 items-center justify-between h-full">
              <div className="text-md text-muted-foreground w-full">Hoje</div>
              <Separator orientation="vertical"/>
              <div className="text-2xl font-bold pl-4 pr-2">{notesToday}</div>
            </CardContent>
          </Card>
          <Card className="rounded-md">
            <CardContent className="flex p-2 px-4 items-center justify-between h-full">
              <div className="text-md text-muted-foreground w-full">Mês</div>
              <Separator orientation="vertical"/>
              <div className="text-2xl font-bold pl-4 pr-2">{notesThisMonth}</div>
            </CardContent>
          </Card>
          <Card className="rounded-md">
            <CardContent className="flex p-2 items-center justify-between h-full">
              <div className="text-md text-muted-foreground w-full">Na Fila</div>
              <Separator orientation="vertical"/>
              <div className="text-2xl font-bold pl-4 pr-2">{formatNumber(queueCount)}</div>
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area type="monotone" dataKey="count" stroke="var(--color-count)" fill="var(--color-count)" fillOpacity={0.1} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}