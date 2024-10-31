// app/api/volume/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.solvor.com.br/dfe/volume_consolidado', {
      headers: {
        Authorization: '763b65c9-108f-4ff6-a79f-2204f608f1fc',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data from external API');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}