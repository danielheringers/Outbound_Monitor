"use client";

import React from "react";
import { Header } from "./components/Header";
import { Footer } from "@/components/Footer/Footer";
import { NFSeChart } from "./components/NFSeChart";
import { ResponseTimeChart } from "./components/ResponseTimeChart";
import { NFeChart } from "./components/NFeChart";

export function MainContent() {
  return (
    <div className="flex flex-col w-full h-screen justify-between">
      <main className="flex-1 transition-all duration-300 ease-in-out">
        <Header />
        <div className="flex w-full justify-between gap-2 p-2">
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
