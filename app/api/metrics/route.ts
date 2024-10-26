import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.orbitspot.com/documentservice/api/metrics', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'a22e2877a10eb7d49e3fcdbb95123714fd7b253ef8aab9ee',
        'token': 'eyJraWQiOiJmNThvcDZUVU0wY0FyZlwvMWJSODJ3ZU5pXC9RUWZUSXZpekJEYUNoYVoySmM9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJjZjNjNzQ1MC04OTg0LTRhYjMtOTAxOC03YTZhNjdhZDY5MTAiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiY3VzdG9tOm1haW5UZW5hbnQiOiI5OGU2NGUwNS0wNTY1LTQyZWUtOTRlNC1kNGU0NWI1MmE5ZjQiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV91NmtkZXZBVUUiLCJjb2duaXRvOnVzZXJuYW1lIjoiY2YzYzc0NTAtODk4NC00YWIzLTkwMTgtN2E2YTY3YWQ2OTEwIiwiYXVkIjoiMnI1cGMxdm85cHVpYTBrcmNtaGYwYmp1cGgiLCJldmVudF9pZCI6IjEwODgwNWI4LTAxYjEtNDQxOS05YTNhLWNlNDYxMmVhNGU5OSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzI3OTgzNzMyLCJuYW1lIjoiRGFuaWVsIGRlIFNvdXphIEhlcmluZ2VyIGRlIE9saXZlaXJhIiwiZXhwIjoxNzI4MDcwMTMyLCJpYXQiOjE3Mjc5ODM3MzIsImVtYWlsIjoiZGFuaWVsLmhlcmluZ2VyQHNlaWRvci5jb20ifQ.EXj-NvJ4EkRHGQsRg5jNKAC0IYZn4piX1T0U4ShvHbQHbwToE0LE0q23IenI8UJAtqvKYgsg2twPeR7zp7CEX3tKv-TmMybLi8WTTd6iZgVB4YhiwcUSU3v7pdHfa-atDml5EP6HCSgNt5Nest26PSRHdEhKxFKuOtqZrujYi_U7euAuVbgwRlzJdae6n-s6an-4hriMrsXPVStebog7lfc-SJHaQjKnlevyiicSj1Afc2RkmgGbNTjneqSH4T7ocUELBCkAfW6TFxuZ1w08bhiXFy9zC0uPwoN4yUb_Q2-IcqXBBzMBQciuguEwB75R9HUpwUpTP1OFswUzifom_Q'
      },
    });

    if (!response.ok) {
      throw new Error('Falha na requisição à API');
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
    return NextResponse.json({ error: 'Falha ao buscar métricas' }, { status: 500 });
  }
}