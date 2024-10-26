"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

type Status = "online" | "inconsistent" | "offline";

interface ApiResponse {
  name: string;
  status: "OPERATIONAL" | "PARTIALOUTAGE" | "MINOROUTAGE" | "MAJOROUTAGE";
}

interface StateStatus {
  name: string;
  status: Status;
}

const mapApiStatusToComponentStatus = (apiStatus: string): Status => {
  switch (apiStatus) {
    case "OPERATIONAL":
      return "online";
    case "PARTIALOUTAGE":
    case "MINOROUTAGE":
      return "inconsistent";
    case "MAJOROUTAGE":
      return "offline";
    default:
      return "inconsistent";
  }
};

const StatusBadge: React.FC<StateStatus> = ({ name, status }) => {
  const getStatusColor = (status: Status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "inconsistent":
        return "bg-yellow-500";
      case "offline":
        return "bg-red-500";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className="flex items-center gap-2 cursor-pointer"
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
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export function Footer() {
  const [generalStatuses, setGeneralStatuses] = useState<StateStatus[]>([]);
  const [stateStatuses, setStateStatuses] = useState<StateStatus[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        const response = await fetch(
          "https://monitorsefaz.webmaniabr.com/v2/components.json"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        console.log("Received data:", JSON.stringify(data, null, 2));

        if (!Array.isArray(data)) {
          if (typeof data === "object" && data !== null) {
            const possibleArray = Object.values(data).find(Array.isArray);
            if (possibleArray) {
              console.log("Found array in object:", possibleArray);
              processData(possibleArray);
              return;
            }
          }
          throw new Error(`Data is not an array. Received: ${typeof data}`);
        }

        processData(data);
      } catch (error) {
        console.error("Error fetching status data:", error);
        setError(`Failed to fetch status data`);
        setGeneralStatuses([]);
        setStateStatuses([]);
      }
    };

    const processData = (data: ApiResponse[]) => {
      const updatedStatuses = data.map((item: ApiResponse) => ({
        name: item.name,
        status: mapApiStatusToComponentStatus(item.status),
      }));

      const general = updatedStatuses.filter(
        (status) => status.name.length > 4
      );
      const states = updatedStatuses.filter((status) => status.name.length < 4);

      setGeneralStatuses(general);
      setStateStatuses(states);
      setError(null);
    };

    fetchStatusData();
    const intervalId = setInterval(fetchStatusData, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (error) {
    return (
      <footer className="border-t">
        <div className="px-4 py-4 text-red-500">{error}</div>
      </footer>
    );
  }

  return (
    <footer className="border-t">
      <div className="px-4 pb-4">
        <div className="flex flex-col w-full">
          <div>
            <h3 className="text-lg font-semibold">Sefaz</h3>
            <div className="flex flex-wrap gap-2">
              {generalStatuses.map((state) => (
                <StatusBadge
                  key={state.name}
                  name={state.name}
                  status={state.status}
                />
              ))}
            </div>
          </div>
          <Separator className="my-2" />
          <div>
            <div className="flex flex-wrap gap-2">
              {stateStatuses.map((state) => (
                <StatusBadge
                  key={state.name}
                  name={state.name}
                  status={state.status}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
