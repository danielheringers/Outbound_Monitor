"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export function Header() {
  const [timeOnline, setTimeOnline] = useState(99.98);
  const [daysSinceLastOutage, setDaysSinceLastOutage] = useState(0);
  const [secondsUntilNextDay, setSecondsUntilNextDay] = useState(0);
  const [nextUpdates, setNextUpdates] = useState([
    { name: "Próxima Atualização", timeLeft: 300 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOnline((prev) => Math.min(100, prev + 0.01));
    }, 60000);

    const updateCounters = () => {
      const now = new Date();
      const lastOutage = new Date("2024-03-01");
      const daysSince = Math.floor(
        (now.getTime() - lastOutage.getTime()) / (1000 * 3600 * 24)
      );
      setDaysSinceLastOutage(daysSince);

      const nextNoon = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        12,
        0,
        0,
        0
      );
      if (now > nextNoon) nextNoon.setDate(nextNoon.getDate() + 1);
      const secondsUntil = Math.floor(
        (nextNoon.getTime() - now.getTime()) / 1000
      );
      setSecondsUntilNextDay(secondsUntil);

      setNextUpdates((prev) =>
        prev.map((update) => ({
          ...update,
          timeLeft: Math.max(0, update.timeLeft - 1),
        }))
      );
    };

    updateCounters();
    const countdownInterval = setInterval(updateCounters, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-2 bg-background border-b flex items-center justify-between">
      <Card className="flex mx-1 w-60 max-h-[6.25rem]">
        <CardContent className="p-4 flex flex-col w-full items-center justify-between">
          <div className="flex w-full items-center justify-between">
            <div className="text-xs sm:text-sm 2xl:text-lg font-medium">
              Tempo Online
            </div>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
            </span>
          </div>
          <Separator className="my-2" />
          <div className="text-xs sm:text-sm 2xl:text-lg font-bold">
            {timeOnline.toFixed(2)}%
          </div>
        </CardContent>
      </Card>
      <Card className="flex mx-1 w-72 max-h-[6.25rem]">
        <CardContent className="p-4 flex flex-col w-full items-center justify-between">
          <div className="flex w-full items-start justify-between">
            <div className="text-xs sm:text-sm 2xl:text-lg font-medium">
              Dias Sem Quedas
            </div>
            <div className="text-xs sm:text-sm 2xl:text-lg font-bold">
              {daysSinceLastOutage}
            </div>
          </div>
          <Separator className="my-2" />
          <div className="text-[10px] sm:text-xs 2xl:text-sm text-muted-foreground">
            {formatTime(secondsUntilNextDay)}
          </div>
        </CardContent>
      </Card>
      {nextUpdates.map((update, index) => (
        <Card key={index} className="flex mx-1 w-72 max-h-[6.25rem]">
          <CardContent className="p-4 flex flex-col w-full items-center justify-between">
            <div className="flex w-full items-center justify-between">
              <div className="text-xs sm:text-sm 2xl:text-lg">
                {update.name}
              </div>
              <div className="text-[10px] sm:text-xs 2xl:text-sm text-muted-foreground font-bold">
                {formatTime(update.timeLeft)}
              </div>
            </div>
            <Separator className="my-2" />
            <div className="flex w-full items-center justify-center p-2">
              <Progress
                value={80}
                className="w-[90%] [&>*]:bg-gradient-to-r from-sky-500 to-blue-500 h-2"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
