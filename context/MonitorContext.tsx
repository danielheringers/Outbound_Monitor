"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

// Tipos para os dados
type NFeData = {
  period: string
  count: number
}

type NFSeData = {
  period: string
  count: number
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

// Tipo para o contexto
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
  if (item.name.length === 4 && item.description) {
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

  const fetchNFeData = async () => {
    try {
      const response = await fetch('/api/metrics')
      if (!response.ok) {
        throw new Error('Falha ao buscar métricas de NFe')
      }
      const data = await response.json()
      const formattedData = data.nfe.map((item: NFeData) => ({
        ...item,
        period: formatDate(item.period)
      }))
      setNfeData(formattedData)
    } catch (err) {
      console.error('Erro ao carregar dados de NFe:', err)
    }
  }

  const fetchNFSeData = async () => {
    try {
      const response = await fetch('/api/metrics')
      if (!response.ok) {
        throw new Error('Falha ao buscar métricas de NFSe')
      }
      const data = await response.json()
      const formattedData = data.nfse.map((item: NFSeData) => ({
        ...item,
        period: formatDate(item.period)
      }))
      setNfseData(formattedData)
    } catch (err) {
      console.error('Erro ao carregar dados de NFSe:', err)
    }
  }

  const fetchStatusData = async () => {
    try {
      const response = await fetch(
        "https://monitorsefaz.webmaniabr.com/v2/components.json"
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()

      if (!Array.isArray(data)) {
        if (typeof data === "object" && data !== null) {
          const possibleArray = Object.values(data).find(Array.isArray)
          if (possibleArray) {
            processData(possibleArray)
            return
          }
        }
        throw new Error(`Data is not an array. Received: ${typeof data}`)
      }

      processData(data)
    } catch (error) {
      console.error("Error fetching status data:", error)
    }
  }

  const processData = (data: ApiResponse[]) => {
    const updatedStatuses = data.map((item: ApiResponse) => ({
      name: item.name,
      status: mapApiStatusToComponentStatus(item.status),
      group: item.group,
      description: item.description
    }))

    const general = updatedStatuses
      .filter((status) => status.name.length > 4)
      .sort((a, b) => a.name.localeCompare(b.name))

    const states = updatedStatuses
      .filter((status) => status.name.length <= 4 && status.group.name === "Autorizadores de NF-e")
      .flatMap(createStateBadges)
      .sort((a, b) => a.name.localeCompare(b.name))

    setGeneralStatuses(general)
    setStateStatuses(states)
  }

  const updateAllData = async () => {
    setIsLoading(true)
    await Promise.all([
      fetchNFeData(),
      fetchNFSeData(),
      fetchStatusData()
    ])
    setIsLoading(false)
  }

  useEffect(() => {
    updateAllData()
    const intervalId = setInterval(updateAllData, 5 * 60 * 1000)
    return () => clearInterval(intervalId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
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