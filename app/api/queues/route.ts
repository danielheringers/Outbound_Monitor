import { NextResponse } from 'next/server';
import type { RabbitMQQueue } from '@/app/types';
import { queueConfigs, QueueConfig } from '@/app/config/queueConfig';

interface GroupedQueue {
  name: string;
  label: string;
  totalMessagesReady: number;
  queues: {
    name: string;
    messages_ready: number;
  }[];
}

function groupQueues(queues: RabbitMQQueue[]): GroupedQueue[] {
  const groupedQueues: { [key: string]: GroupedQueue } = {};

  queues.forEach((queue) => {
    const [documentType, , queueType] = queue.name.split('-');
    const key = `${documentType}-${queueType}`;
    const config: QueueConfig = queueConfigs[key] || { label: key };

    if (!groupedQueues[key]) {
      groupedQueues[key] = {
        name: key,
        label: config.label,
        totalMessagesReady: 0,
        queues: [],
      };
    }

    groupedQueues[key].totalMessagesReady += queue.messages_ready;
    groupedQueues[key].queues.push({
      name: queue.name,
      messages_ready: queue.messages_ready,
    });
  });

  return Object.values(groupedQueues);
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
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch queues');
    }

    const data: RabbitMQQueue[] = await response.json();
    const groupedData = groupQueues(data);

    return NextResponse.json(groupedData);
  } catch (error) {
    console.error('Error fetching queues:', error);
    return NextResponse.json({ error: 'Failed to fetch queues' }, { status: 500 });
  }
}