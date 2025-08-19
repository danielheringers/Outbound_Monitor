"use client";

import { useState, useEffect } from "react";
import { useMonitor } from "@/context/MonitorContext";
import { BellIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AudioAlert() {
  const { nfeData, nfseData } = useMonitor();
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);

  const toggleAudioAlert = () => {
    setIsEnabled(!isEnabled);
  };

  useEffect(() => {
    const context = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    setAudioContext(context);
    return () => {
      if (context) {
        context.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!audioContext || !isEnabled || !nfeData || !nfseData) return;

    const shouldAlert =
      nfeData[nfeData.length - 1]?.meanResponseTime > 500 ||
      nfeData[nfeData.length - 1]?.count <= 0 ||
      nfseData[nfseData.length - 1]?.count === 0;

    const playAlertSound = () => {
      if (!audioContext) return;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    };

    if (shouldAlert) {
      playAlertSound();
    }
  }, [nfeData, nfseData, audioContext, isEnabled]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAudioAlert}
            className="relative p-0"
          >
            <BellIcon className="h-5 w-5" />
            {isEnabled && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isEnabled ? "Desativar alerta sonoro" : "Ativar alerta sonoro"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
