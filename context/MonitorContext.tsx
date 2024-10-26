"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

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

type MonitorContextType = {
  nfeData: NFeData[]
  nfseData: NFSeData[]
  generalStatuses: StatusData[]
  stateStatuses: StatusData[]
  updateAllData: () => Promise<void>
  isLoading: boolean
}

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
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async (endpoint: string) => {
    const response = await fetch(`/api/${endpoint}`)
    if (!response.ok) {
      throw new Error(`Falha ao buscar dados de ${endpoint}`)
    }
    return response.json()
  }

  const fetchMetricsData = async () => {
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
  }

  const fetchStatusData = async () => {
    try {
      const data: ApiResponse[] = await fetchData('status')
      processData(data)
    } catch (error) {
      console.error("Error fetching status data:", error)
      setGeneralStatuses([])
      setStateStatuses([])
    }
  }

  const processData = (data: ApiResponse[]) => {
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
  }

  const updateAllData = async () => {
    setIsLoading(true)
    await Promise.all([
      fetchMetricsData(),
      fetchStatusData()
    ])
    setIsLoading(false)
  }

  useEffect(() => {
    updateAllData()
    const intervalId = setInterval(updateAllData, 5 * 60 * 1000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <MonitorContext.Provider value={{
      nfeData,
      nfseData,
      generalStatuses,
      stateStatuses,
      updateAllData,
      isLoading
    }}>
      {children}
    </MonitorContext.Provider>
  )
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })
}