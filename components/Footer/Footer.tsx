"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { useMonitor } from "@/context/MonitorContext"

type Status = "online" | "inconsistent" | "offline"

interface StateStatus {
  name: string
  status: Status
  group: { name: string }
  description: string
}

const StatusBadge: React.FC<StateStatus> = ({ name, status, description }) => {
  const getStatusColor = (status: Status) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "inconsistent":
        return "bg-yellow-500"
      case "offline":
        return "bg-red-500"
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className="flex items-center gap-2 cursor-pointer text-[12px]"
          >
            {name}
          
            <span className="relative flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${getStatusColor(
                  status
                )}`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${getStatusColor(
                  status
                )}`}
              ></span>
            </span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="p-2 rounded-md">
          <p>{status.charAt(0).toUpperCase() + status.slice(1)}</p>
          {description && <p className="text-xs mt-1">{description}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const StatusBadgeGeral: React.FC<StateStatus> = ({ name, status, description }) => {
  const getStatusColor = (status: Status) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "inconsistent":
        return "bg-yellow-500"
      case "offline":
        return "bg-red-500"
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className="flex items-center gap-2 cursor-pointer text-[16px]"
          >
            {name}
            <Separator orientation="vertical"/>
            <span className="relative flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${getStatusColor(
                  status
                )}`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${getStatusColor(
                  status
                )}`}
              ></span>
            </span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="p-2 rounded-md">
          <p>{status.charAt(0).toUpperCase() + status.slice(1)}</p>
          {description && <p className="text-xs mt-1">{description}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function Footer() {
  const { generalStatuses, stateStatuses, isLoading } = useMonitor()

  if (isLoading) {
    return (
      <footer className="border-t">
        <div className="px-4 py-4">Carregando...</div>
      </footer>
    )
  }

  return (
    <footer className="border-t">
      <div className="pb-4">
        <div className="flex flex-col w-full">
          <div className="flex flex-row w-full pt-2 justify-start px-4">
            <h3 className="text-lg font-semibold">Sefaz</h3>
            <div className="flex gap-2 w-full items-center justify-center">
              {generalStatuses.map((state) => (
                <StatusBadgeGeral
                  key={state.name}
                  name={state.name}
                  status={state.status}
                  group={state.group}
                  description={state.description}
                />
              ))}
            </div>
          </div>
          <Separator className="my-2" />
          <div>
            <div className="flex flex-wrap gap-2 justify-center px-4">
              {stateStatuses.map((state) => (
                <StatusBadge
                  key={state.name}
                  name={state.name}
                  status={state.status}
                  group={state.group}
                  description={state.description}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}