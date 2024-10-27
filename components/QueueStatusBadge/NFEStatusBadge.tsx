'use client'

import { useMonitor } from '@/context/MonitorContext'
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatNumber } from '@/lib/utils'
export default function NFEStatusBadge() {
  const { queueData } = useMonitor()
  const queueCount = queueData.nfeEmit?.totalMessagesReady || 0

  return (
    <Card className="rounded-md">
      <CardContent className="p-2 flex items-center space-x-2">
        <span className="text-sm font-medium text-muted-foreground">NF-e Emissão</span>
        <Separator orientation="vertical" className="h-4" />
        <span className="text-sm font-bold">{formatNumber(queueCount)}</span>
      </CardContent>
    </Card>
  )
}