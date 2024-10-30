import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/services/authService';

const ALLOWED_MAC_ADDRESS = process.env.AUTO_LOGIN_MAC_ADDRESS || '';
const AUTO_LOGIN_USERNAME = process.env.AUTO_LOGIN_USERNAME || '';
const AUTO_LOGIN_PASSWORD = process.env.AUTO_LOGIN_PASSWORD || '';

export async function POST(request: NextRequest) {
  try {
    const macAddress = request.headers.get('x-mac-address');

    if (macAddress === ALLOWED_MAC_ADDRESS) {
      // Perform automatic login
      const authResponse = await login(AUTO_LOGIN_USERNAME, AUTO_LOGIN_PASSWORD);
      return NextResponse.json({ success: true, user: authResponse.data });
    }

    // Regular authentication
    const { username, password } = await request.json();
    const authResponse = await login(username, password);
    return NextResponse.json({ success: true, user: authResponse.data });
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ error: 'Falha na autenticação' }, { status: 401 });
  }
}