'use client'

import { useMonitor } from '@/context/MonitorContext'
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatNumber } from '@/lib/utils'
export default function CTEOSStatusBadge() {
  const { queueData } = useMonitor()
  const queueCount = queueData.cteosEmit?.totalMessagesReady || 0

  return (
    <Card className="rounded-md">
      <CardContent className="p-2 flex items-center space-x-2">
        <span className="text-sm font-medium text-muted-foreground">CTE-os Emissão</span>
        <Separator orientation="vertical" className="h-4" />
        <span className="text-sm font-bold">{formatNumber(queueCount)}</span>
      </CardContent>
    </Card>
  )
}