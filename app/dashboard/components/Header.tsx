"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useMonitor } from "@/context/MonitorContext";
import CircularProgress from "@/components/CircularProgress";
interface Incident {
  end_time: string;
  duration: number;
}
export function Header() {
  const { updateAllData, isLoading } = useMonitor();
  const [timeOnline, setTimeOnline] = useState(0);
  const [daysSinceLastOutage, setDaysSinceLastOutage] = useState(0);
  const [secondsUntilNextDay, setSecondsUntilNextDay] = useState(0);
  const [nextUpdates, setNextUpdates] = useState([
    { name: "Próxima Atualização", timeLeft: 300, initialTime: 300 },
  ]);

  useEffect(() => {
    async function fetchIncidents() {
      try {
        const response = await fetch("/api/downtime");
        if (!response.ok) {
          throw new Error("Failed to fetch incidents");
        }
        const data = await response.json();
        calculateTimeOnline(data);
        calculateDaysSinceLastOutage(data);
      } catch (err) {
        console.error("Error fetching incidents:", err);
      }
    }

    fetchIncidents();
  }, []);

  const calculateTimeOnline = (incidents: Incident[]) => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const totalHours =
      (now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60);

    const downtimeHours = incidents.reduce((total, incident) => {
      return total + incident.duration / 60;
    }, 0);

    const onlinePercentage = ((totalHours - downtimeHours) / totalHours) * 100;
    setTimeOnline(parseFloat(onlinePercentage.toFixed(2)));
  };

  const calculateDaysSinceLastOutage = (incidents: Incident[]): void => {
    if (incidents.length === 0) return;

    const lastOutage = new Date(
      Math.max(...incidents.map((i) => new Date(i.end_time).getTime()))
    );
    const now = new Date();
    const daysSince = Math.floor(
      (now.getTime() - lastOutage.getTime()) / (1000 * 60 * 60 * 24)
    );
    setDaysSinceLastOutage(daysSince);
  };

  useEffect(() => {
    const updateCounters = () => {
      const now = new Date();
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
        prev.map((update) => {
          const newTimeLeft = update.timeLeft - 1;
          if (newTimeLeft <= 0) {
            updateAllData();
            return { ...update, timeLeft: update.initialTime };
          }
          return { ...update, timeLeft: Math.max(0, newTimeLeft) };
        })
      );
    };

    updateCounters();
    const countdownInterval = setInterval(updateCounters, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [updateAllData]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const formatTimeHour = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-8 border-b grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      <Card className="flex w-full max-h-[7rem] bg-card sm:px-4 lg:px-12 items-center">
        <CardContent className="flex w-full h-[7rem] items-center justify-between px-4 py-3 gap-2">
          <CardTitle className="text-xs sm:text-sm 2xl:text-lg font-medium">
            Tempo Online
          </CardTitle>
          <Separator className="my-2 h-8" orientation="vertical" />
          <CircularProgress
            value={timeOnline}
            size={75}
            strokeWidth={5}
            textSize="text-base font-bold"
          />
        </CardContent>
      </Card>

      <Card className="flex w-full max-h-[7rem]">
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
          <div className="text-lg text-muted-foreground">
            {formatTimeHour(secondsUntilNextDay)}
          </div>
        </CardContent>
      </Card>

      {nextUpdates.map((update, index) => (
        <Card
          key={index}
          className="flex w-full max-h-[7rem] sm:col-span-2 md:col-span-1"
        >
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
              {isLoading ? (
                <div className="w-[90%] h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 animate-pulse"></div>
                </div>
              ) : (
                <Progress
                  value={
                    ((update.initialTime - update.timeLeft) /
                      update.initialTime) *
                    100
                  }
                  className="w-[90%] [&>*]:bg-gradient-to-r from-rose-500 to-amber-500 h-2"
                />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
