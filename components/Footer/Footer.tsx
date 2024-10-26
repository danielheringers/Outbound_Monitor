"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";

type Status = "online" | "inconsistent" | "offline";

interface StateStatus {
  uf: string;
  status: Status;
}

const stateStatuses: StateStatus[] = [
  { uf: "AC", status: "online" },
  { uf: "AL", status: "online" },
  { uf: "AM", status: "online" },
  { uf: "AP", status: "online" },
  { uf: "BA", status: "offline" },
  { uf: "CE", status: "online" },
  { uf: "DF", status: "online" },
  { uf: "ES", status: "online" },
  { uf: "GO", status: "online" },
  { uf: "MA", status: "online" },
  { uf: "MG", status: "inconsistent" },
  { uf: "MS", status: "online" },
  { uf: "MT", status: "online" },
  { uf: "PA", status: "online" },
  { uf: "PB", status: "online" },
  { uf: "PE", status: "online" },
  { uf: "PI", status: "online" },
  { uf: "PR", status: "online" },
  { uf: "RJ", status: "online" },
  { uf: "RN", status: "inconsistent" },
  { uf: "RO", status: "inconsistent" },
  { uf: "RR", status: "online" },
  { uf: "RS", status: "online" },
  { uf: "SC", status: "online" },
  { uf: "SE", status: "online" },
  { uf: "SP", status: "online" },
  { uf: "TO", status: "online" },
];

const StatusBadge: React.FC<StateStatus> = ({ uf, status }) => {
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
    <Badge variant="outline" className="flex items-center gap-2">
      {uf}
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
  );
};

export function Footer() {
  return (
    <footer className="border-t">
      <div className="px-4 py-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-auto mb-4 md:mb-0">
            <div className="flex flex-wrap gap-2">
              {stateStatuses.map((state) => (
                <StatusBadge key={state.uf} uf={state.uf} status={state.status} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}