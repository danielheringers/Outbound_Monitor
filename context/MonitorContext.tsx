"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface NFeData {
  label: "Emissões";
  period: string;
  count: number;
  meanResponseTime: number;
}

export interface NFSeData {
  label: "Emissões";
  period: string;
  count: number;
  meanResponseTime: number;
}

export interface Metrics {
  nfe: NFeData[];
  nfse: NFSeData[];
}

type ApiResponse = {
  id: string
  name: string
  description: string
  status: "OPERATIONAL" | "PARTIALOUTAGE" | "MINOROUTAGE" | "MAJOROUTAGE"
  group: {
    id: string
    name: string
    description: string
  }
}

type Status = "online" | "inconsistent" | "offline"

type StatusData = {
  name: string
  status: Status
  group: {
    id: string
    name: string
    description: string
  }
  description: string
}

type QueueData = {
  name: string
  label: string
  totalMessagesReady: number
}

type MonitorContextType = {
  nfeData: NFeData[];
  nfseData: NFSeData[];
  generalStatuses: StatusData[];
  stateStatuses: StatusData[];
  notesToday: {
    nfe: number;
    nfse: number;
  };
  notesThisMonth: {
    nfe: number;
    nfse: number;
  };
  queueData: {
    nfeEmit: QueueData | null;
    nfseEmit: QueueData | null;
    nfseCancel: QueueData | null;
    nfseQueryNfse: QueueData | null;
    nfseQueryRpsProtocol: QueueData | null;
    cteosEmit: QueueData | null;
    RPS: QueueData | null;
  };
  updateAllData: () => Promise<void>;
  isLoading: boolean;
};

const MonitorContext = createContext<MonitorContextType | undefined>(undefined)

export const useMonitor = () => {
  const context = useContext(MonitorContext)
  if (!context) {
    throw new Error('useMonitor must be used within a MonitorProvider')
  }
  return context
}

const mapApiStatusToComponentStatus = (apiStatus: string): Status => {
  switch (apiStatus) {
    case "OPERATIONAL":
      return "online"
    case "PARTIALOUTAGE":
      return "inconsistent"
    case "MINOROUTAGE":
      return "inconsistent"
    case "MAJOROUTAGE":
      return "offline"
    default:
      return "inconsistent"
  }
}

const createStateBadges = (item: StatusData): StatusData[] => {
  if (item.name && item.name.length === 4 && item.description) {
    const states = item.description.split(', ')
    return states.map((state) => ({
      name: state,
      status: item.status,
      group: item.group,
      description: `${item.name}: ${item.description}`
    }))
  }
  return [item]
}

export const MonitorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nfeData, setNfeData] = useState<NFeData[]>([])
  const [nfseData, setNfseData] = useState<NFSeData[]>([])
  const [generalStatuses, setGeneralStatuses] = useState<StatusData[]>([])
  const [stateStatuses, setStateStatuses] = useState<StatusData[]>([])
  const [notesToday, setNotesToday] = useState({ nfe: 0, nfse: 0 });
  const [notesThisMonth, setNotesThisMonth] = useState({ nfe: 0, nfse: 0 });
  const [queueData, setQueueData] = useState<MonitorContextType['queueData']>({
    nfeEmit: null,
    nfseEmit: null,
    cteosEmit: null,
    nfseCancel: null,
    nfseQueryNfse: null,
    nfseQueryRpsProtocol: null,
    RPS: null,
  })
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = useCallback(async (endpoint: string) => {
    const response = await fetch(`/api/${endpoint}`, {
      cache: 'no-store'
    })
    if (!response.ok) {
      throw new Error(`Falha ao buscar dados de ${endpoint}`)
    }
    return response.json()
  }, [])

  const fetchMetricsData = useCallback(async () => {
    try {
      const data: Metrics = await fetchData('metrics')
      const formattedNFeData = data.nfe.map((item: NFeData) => ({
        ...item,
        period: formatDate(item.period)
      }))
      const formattedNFSeData = data.nfse.map((item: NFSeData) => ({
        ...item,
        period: formatDate(item.period)
      }))
      setNfeData(formattedNFeData)
      setNfseData(formattedNFSeData)
    } catch (err) {
      console.error('Erro ao carregar dados de métricas:', err)
      setNfeData([])
      setNfseData([])
    }
  }, [fetchData]);
  

  const fetchQueueData = useCallback(async () => {
    try {
      const response = await fetch('/api/queues', {
        headers: {
          'Cache-Control': 'no-store',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch queue data');
      }
  
      const data: QueueData[] = await response.json();
      const rpsQueues = data.filter(queue => queue.name.startsWith('rps-'));
      const rpsTotal = rpsQueues.reduce((sum, queue) => sum + queue.totalMessagesReady, 0);
  
      setQueueData({
        nfeEmit: data.find(queue => queue.name === 'nfe-emit') || null,
        nfseEmit: data.find(queue => queue.name === 'nfse-emit') || null,
        nfseCancel: data.find(queue => queue.name === 'nfse-cancel') || null,
        nfseQueryNfse: data.find(queue => queue.name === 'nfse-queryNfse') || null,
        nfseQueryRpsProtocol: data.find(queue => queue.name === 'nfse-queryRpsProtocol') || null,
        cteosEmit: data.find(queue => queue.name === 'cteOs-emit') || null,
        RPS: {
          name: 'RPS',
          label: 'RPS',
          totalMessagesReady: rpsTotal,
        },
      });
    } catch (error) {
      console.error('Error fetching queue data:', error);
      setQueueData({
        nfeEmit: null,
        nfseEmit: null,
        cteosEmit: null,
        nfseCancel: null,
        nfseQueryNfse: null,
        nfseQueryRpsProtocol: null,
        RPS: null,
      });
    }
  }, []);

  const processData = useCallback((data: ApiResponse[]) => {
    if (!Array.isArray(data)) {
      console.error("Status data is not an array")
      setGeneralStatuses([])
      setStateStatuses([])
      return
    }

    const updatedStatuses = data
      .filter((item): item is ApiResponse => !!item && typeof item === 'object' && 'name' in item && 'status' in item)
      .map((item: ApiResponse) => ({
        name: item.name,
        status: mapApiStatusToComponentStatus(item.status),
        group: item.group,
        description: item.description
      }))

    const general = updatedStatuses
      .filter((status) => status.name && status.name.length > 4)
      .sort((a, b) => a.name.localeCompare(b.name))

    const states = updatedStatuses
      .filter((status) => status.name && status.name.length <= 4 && status.group && status.group.name === "Autorizadores de NF-e")
      .flatMap(createStateBadges)
      .sort((a, b) => a.name.localeCompare(b.name))

    setGeneralStatuses(general)
    setStateStatuses(states)
  }, [])

  const fetchStatusData = useCallback(async () => {
    try {
      const data: ApiResponse[] = await fetchData('status')
      processData(data)
    } catch (err) {
      console.error('Error fetching status data:', err)
      setGeneralStatuses([])
      setStateStatuses([])
    }
  }, [fetchData])


  const fetchVolumeConsolidado = useCallback(async () => {
    try {
      const data = await fetchData('volume');
      setNotesToday({
        nfe: data.nfe_dia,
        nfse: data.nfse_dia,
      });
      setNotesThisMonth({
        nfe: data.nfe_mes,
        nfse: data.nfse_mes,
      });
    } catch (err) {
      console.error('Error fetching volume consolidado data:', err);
      setNotesToday({
        nfe: 0,
        nfse: 0,
      });
      setNotesThisMonth({
        nfe: 0,
        nfse: 0,
      });
    }
  }, [fetchData]);

  const updateAllData = useCallback(async () => {
    setIsLoading(true)
    await Promise.all([
      fetchMetricsData(),
      fetchStatusData(),
      fetchQueueData(),
      fetchVolumeConsolidado(),
    ])
    setIsLoading(false)
  }, [fetchMetricsData, fetchStatusData, fetchQueueData, fetchVolumeConsolidado])

  useEffect(() => {
    updateAllData()
    const intervalId = setInterval(updateAllData, 5 * 60 * 1000)
    return () => clearInterval(intervalId)
  }, [updateAllData])

  useEffect(() => {
    const checkCounterReset = () => {
      const now = new Date()
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        updateAllData()
      }
    }
    const intervalId = setInterval(checkCounterReset, 60000) 
    return () => clearInterval(intervalId)
  }, [updateAllData])

  return (
    <MonitorContext.Provider value={{
      nfeData,
      nfseData,
      generalStatuses,
      stateStatuses,
      queueData,
      updateAllData,
      notesToday,
      notesThisMonth,
      isLoading,
    }}>
      {children}
    </MonitorContext.Provider>
  )
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })
}