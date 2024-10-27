export interface QueueConfig {
    label: string;
    group?: string;
  }
  
  export const queueConfigs: Record<string, QueueConfig> = {
    'nfe-emit': { label: 'NF-e' },
    'nfse-emit': { label: 'Emissão' },
    'nfse-cancel': { label: 'Cancelamento' },
    'nfse-queryNfse': { label: 'Query Nfse' },
    'nfse-queryRpsProtocol': { label: 'RPS Protocol' },
    'cteOs-emit': { label: 'CTE-OS' },
    'rps-': { label: 'RPS' },
  };