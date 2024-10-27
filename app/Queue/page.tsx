import QueueStatusCards from '@/components/QueueStatusCard'

export default function RabbitMonitor() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Rabbit Monitor</h1>
      <QueueStatusCards />

    </main>
  )
}