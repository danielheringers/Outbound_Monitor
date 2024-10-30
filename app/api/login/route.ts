import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/services/authService';

// const ALLOWED_MAC_ADDRESS = process.env.AUTO_LOGIN_MAC_ADDRESS || '';
const AUTO_LOGIN_USERNAME = process.env.AUTO_LOGIN_USERNAME || '';
const AUTO_LOGIN_PASSWORD = process.env.AUTO_LOGIN_PASSWORD || '';

export async function POST(request: NextRequest) {
  try {
    const { username, password, isTvBrowser } = await request.json();

    if (isTvBrowser) {
      // Automatic login for TV browser
      if (AUTO_LOGIN_USERNAME && AUTO_LOGIN_PASSWORD) {
        const authResponse = await login(AUTO_LOGIN_USERNAME, AUTO_LOGIN_PASSWORD);
        return NextResponse.json({ success: true, user: authResponse.data });
      } else {
        throw new Error('Automatic login credentials not configured');
      }
    } else {
      // Regular authentication for other devices
      const authResponse = await login(username, password);
      return NextResponse.json({ success: true, user: authResponse.data });
    }
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ error: 'Falha na autenticação' }, { status: 401 });
  }
}