"use client";

import { useMonitor } from "@/context/MonitorContext";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { Separator } from "../ui/separator";

export default function NFSERPSStatusBadge() {
  const { queueData } = useMonitor();
  const nfseEmit = queueData.nfseEmit?.totalMessagesReady || 0;
  const nfseCancel = queueData.nfseCancel?.totalMessagesReady || 0;
  const nfseQueryNfse = queueData.nfseQueryNfse?.totalMessagesReady || 0;
  const nfseQueryRpsProtocol =
    queueData.nfseQueryRpsProtocol?.totalMessagesReady || 0;
  const RPS = queueData.RPS?.totalMessagesReady || 0;

  return (
    <div className="flex flex-wrap md:justify-center lg:justify-end gap-2">
      <Card className="rounded-md">
        <CardContent className="p-2 flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground">
            Emissão
          </span>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-bold">{formatNumber(nfseEmit)}</span>
        </CardContent>
      </Card>
      <Card className="rounded-md">
        <CardContent className="p-2 flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground lg:truncate lg:max-w-full lg:overflow-hidden lg:text-ellipsis lg:whitespace-nowrap">
            Cancelamento
          </span>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-bold">{formatNumber(nfseCancel)}</span>
        </CardContent>
      </Card>
      <Card className="rounded-md">
        <CardContent className="p-2 flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground">
            Query Nfse
          </span>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-bold">
            {formatNumber(nfseQueryNfse)}
          </span>
        </CardContent>
      </Card>
      <Card className="rounded-md">
        <CardContent className="p-2 flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground">
            RPS Protocol
          </span>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-bold">
            {formatNumber(nfseQueryRpsProtocol)}
          </span>
        </CardContent>
      </Card>
      <Card className="rounded-md">
        <CardContent className="p-2 flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground">RPS</span>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-bold">{formatNumber(RPS)}</span>
        </CardContent>
      </Card>
    </div>
  );
}
