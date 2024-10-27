"use client";

import React from "react";
import { Header } from "./components/Header";
import { Footer } from "@/components/Footer/Footer";
import { NFSeChart } from "./components/NFSeChart";
import { ResponseTimeChart } from "./components/ResponseTimeChart";
import { NFeChart } from "./components/NFeChart";

export function MainContent() {
  return (
    <div className="space-y-6 h-full overflow-auto">
      <main>
        <Header />
        <div className="flex w-full items-center justify-center pt-2">
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2 mt-4">
          <NFSeChart />
          <NFeChart />
        </div>
        <div className="p-2">
          <ResponseTimeChart />
        </div>
      </main>
      <Footer />
    </div>
  );
}
