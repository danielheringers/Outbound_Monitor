// types.ts
export interface NFeData {
  period: string;
  count: number;
  meanResponseTime: number;
}

export interface NFSeData {
  period: string;
  count: number;
  meanResponseTime: number;
}

export interface Metrics {
  nfe: NFeData[];
  nfse: NFSeData[];
}
