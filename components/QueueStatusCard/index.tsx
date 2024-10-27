'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface GroupedQueue {
  name: string;
  label: string;
  totalMessagesReady: number;
}

export default function QueueStatusCards() {
  const [groupedQueues, setGroupedQueues] = useState<GroupedQueue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchQueues() {
      try {
        const response = await fetch('/api/queues')
        if (!response.ok) {
          throw new Error('Failed to fetch queues')
        }
        const data: GroupedQueue[] = await response.json()
        setGroupedQueues(data)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
        setLoading(false)
      }
    }

    fetchQueues()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {groupedQueues.map((group) => (
        <Card key={group.name} className="shadow-sm">
          <CardContent className="p-4 flex flex-col items-center">
            <h3 className="text-sm font-medium">{group.name}</h3>
            <Separator className="my-2 w-full" />
            <p className="text-2xl font-bold">{group.totalMessagesReady}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}