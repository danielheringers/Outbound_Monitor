import { NextResponse } from 'next/server';
import type { RabbitMQQueue } from '@/app/types';

// Define the expected queue data structure that matches the context
interface QueueData {
  name: string;
  label: string;
  totalMessagesReady: number;
}

export async function GET() {
  const url = 'https://b-6d6afe41-5e03-49e4-8f0b-3bd3853b6198.mq.us-east-1.amazonaws.com/api/queues';
  const username = process.env.RABBITMQ_USERNAME;
  const password = process.env.RABBITMQ_PASSWORD;

  if (!username || !password) {
    return NextResponse.json({ error: 'RabbitMQ credentials are not set' }, { status: 500 });
  }

  const authHeader = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': authHeader,
        'Cache-Control': 'no-store, max-age=0',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch queues');
    }

    const rawData: RabbitMQQueue[] = await response.json();
    
    // Transform the data to match the expected structure
    const transformedData = rawData.reduce((acc: { [key: string]: QueueData }, queue) => {
      // Extract the document type and queue type
      const [documentType, , queueType] = queue.name.split('-');
      if (!documentType || !queueType) return acc;

      const key = `${documentType}-${queueType}`;
      
      if (!acc[key]) {
        acc[key] = {
          name: key,
          label: `${documentType.toUpperCase()} ${queueType}`,
          totalMessagesReady: 0
        };
      }
      
      acc[key].totalMessagesReady += queue.messages_ready;
      return acc;
    }, {});

    // Convert to array and add special handling for RPS queues
    const queueData = Object.values(transformedData);
    const rpsQueues = rawData.filter(queue => queue.name.startsWith('rps-'));
    if (rpsQueues.length > 0) {
      queueData.push({
        name: 'RPS',
        label: 'RPS',
        totalMessagesReady: rpsQueues.reduce((sum, queue) => sum + queue.messages_ready, 0)
      });
    }

    return NextResponse.json(queueData);
  } catch (error) {
    console.error('Error fetching queues:', error);
    return NextResponse.json({ error: 'Failed to fetch queues' }, { status: 500 });
  }
}