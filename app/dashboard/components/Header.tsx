'use client'

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function Header() {
  const [timeOnline, setTimeOnline] = useState(99.98)
  const [daysSinceLastOutage, setDaysSinceLastOutage] = useState(0)
  const [secondsUntilNextDay, setSecondsUntilNextDay] = useState(0)
  const [nextUpdates, setNextUpdates] = useState([
    { name: "Próxima Atualização: ", timeLeft: 3600 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOnline((prev) => Math.min(100, prev + 0.01))
    }, 60000)

    const updateCounters = () => {
      const now = new Date()
      const lastOutage = new Date("2023-01-01")
      const daysSince = Math.floor(
        (now.getTime() - lastOutage.getTime()) / (1000 * 3600 * 24)
      )
      setDaysSinceLastOutage(daysSince)

      const nextNoon = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        12,
        0,
        0,
        0
      )
      if (now > nextNoon) nextNoon.setDate(nextNoon.getDate() + 1)
      const secondsUntil = Math.floor(
        (nextNoon.getTime() - now.getTime()) / 1000
      )
      setSecondsUntilNextDay(secondsUntil)

      setNextUpdates((prev) =>
        prev.map((update) => ({
          ...update,
          timeLeft: Math.max(0, update.timeLeft - 1),
        }))
      )
    }

    updateCounters()
    const countdownInterval = setInterval(updateCounters, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(countdownInterval)
    }
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="p-2 bg-background border-b flex items-center justify-between">
      <Card className="flex mx-1 max-w-60">
        <CardContent className="p-2 flex h-[68px] w-60 items-center justify-between pr-6">
          <div>
            <div className="text-xs font-medium">Tempo Online</div>
            <div className="text-sm font-bold">
              {timeOnline.toFixed(2)}%
            </div>
          </div>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
          </span>
        </CardContent>
      </Card>
      <Card className="flex mx-1 w-60">
        <CardContent className="p-4 flex h-[68px] w-full items-center justify-between">
          <div className="flex w-full flex-col items-start justify-between">
            <div className="text-xs font-medium">Dias Sem Quedas</div>
            <div className="text-sm font-bold">{daysSinceLastOutage}</div>
          </div>
          <div className="text-xs text-muted-foreground">
            {formatTime(secondsUntilNextDay)}
          </div>
        </CardContent>
      </Card>
      {nextUpdates.map((update, index) => (
        <Card key={index} className="flex mx-1 w-60">
          <CardContent className="p-4 flex flex-col h-[68px] w-full items-center justify-between">
            <div className="flex w-full items-center justify-between">
              <div className="text-xs font-bold">{update.name}</div>
              <div className="text-xs text-muted-foreground font-bold">
                {formatTime(update.timeLeft)}
              </div>
            </div>
            <Progress value={80} className="w-[90%] [&>*]:bg-gradient-to-r from-pink-500 to-yellow-500 h-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}