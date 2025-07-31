"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MainContent } from "./main-content";
import dynamic from "next/dynamic";
import RefreshPageButton from "@/components/RefreshPageButton";

const KeepAlive = dynamic(() => import("@/components/KeepAlive"), {
  ssr: false,
});

export function DashboardContent() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
        className="h-full"
      />
      <div className="flex-1 overflow-auto">
        <MainContent />
      </div>
      <RefreshPageButton />
      <KeepAlive />
    </div>
  );
}
