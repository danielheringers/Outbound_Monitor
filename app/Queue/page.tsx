"use client";
import QueueStatusCards from "@/components/QueueStatusCard";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";

export default function RabbitMonitor() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
        className="h-full"
      />
      <div className="flex-1 overflow-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Rabbit Monitor</h1>
        <QueueStatusCards />
      </div>
    </div>
  );
}