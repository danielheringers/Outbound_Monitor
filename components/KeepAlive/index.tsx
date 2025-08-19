"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";

export default function KeepAlive() {
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    const keepAlive = () => {
      // Realizar uma ação simples para manter a TV ativa
      console.log("Keeping TV alive:", new Date().toISOString());
      setLastActivity(Date.now());

      // Mover o cursor para uma posição aleatória na tela
      const x = Math.floor(Math.random() * window.innerWidth);
      const y = Math.floor(Math.random() * window.innerHeight);
      const event = new MouseEvent("mousemove", {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
      });
      document.dispatchEvent(event);
    };

    const interval = setInterval(keepAlive, 60000); // Executar a cada minuto

    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(interval);
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="p-2 bg-gray-700/70 rounded-full cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
              />
            </svg>
          </div>
        </TooltipTrigger>

        <TooltipContent side="left" align="center" className="p-2 rounded-md">
          <p className="text-[13px] p-1 rounded-md bg-neutral-950">
            Última atividade:{" "}
            <b>{new Date(lastActivity).toLocaleTimeString()}</b>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
