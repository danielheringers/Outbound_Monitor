'use client'

import { useMonitor } from '@/context/MonitorContext'
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatNumber } from '@/lib/utils'

export default function NFSERPSStatusBadge() {
  const { queueData } = useMonitor()
  const nfseEmit = queueData.nfseEmit?.totalMessagesReady || 0
  const nfseCancel = queueData.nfseCancel?.totalMessagesReady || 0
  const nfseQueryNfse = queueData.nfseQueryNfse?.totalMessagesReady || 0
  const nfseQueryRpsProtocol = queueData.nfseQueryRpsProtocol?.totalMessagesReady || 0
  const RPS = queueData.RPS?.totalMessagesReady || 0

  return (
    <Card className="rounded-md">
      <CardContent className="p-2 flex items-center space-x-2">
        <span className="text-sm font-medium text-muted-foreground">Emissão</span>
        <span className="text-sm font-bold">{formatNumber(nfseEmit)}</span>
        <Separator orientation="vertical" className="h-4" />
        <span className="text-sm font-medium text-muted-foreground">Cancelamento</span>
        <span className="text-sm font-bold">{formatNumber(nfseCancel)}</span>
        <Separator orientation="vertical" className="h-4" />
        <span className="text-sm font-medium text-muted-foreground">Query Nfse</span>
        <span className="text-sm font-bold">{formatNumber(nfseQueryNfse)}</span>
        <Separator orientation="vertical" className="h-4" />
        <span className="text-sm font-medium text-muted-foreground">RPS Protocol</span>
        <span className="text-sm font-bold">{formatNumber(nfseQueryRpsProtocol)}</span>
        <Separator orientation="vertical" className="h-4" />
        <span className="text-sm font-medium text-muted-foreground">RPS</span>
        <span className="text-sm font-bold">{formatNumber(RPS)}</span>
      </CardContent>
    </Card>
  )
}