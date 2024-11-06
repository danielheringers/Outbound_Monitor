import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.set('token', '', { expires: new Date(0) });
  response.cookies.set('x-api-key', '', { expires: new Date(0) });
  return response;
}