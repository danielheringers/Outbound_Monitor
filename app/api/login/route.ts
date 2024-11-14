import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/services/authService';

const AUTO_LOGIN_USERNAME = process.env.AUTO_LOGIN_USERNAME || '';
const AUTO_LOGIN_PASSWORD = process.env.AUTO_LOGIN_PASSWORD || '';

export async function POST(request: NextRequest) {
  try {
    const { username, password, isTvBrowser } = await request.json();

    if (isTvBrowser === 'true') {
      if (!AUTO_LOGIN_USERNAME || !AUTO_LOGIN_PASSWORD) {
        throw new Error('Credenciais de auto-login não configuradas');
      }

      try {
        const authResponse = await login(AUTO_LOGIN_USERNAME, AUTO_LOGIN_PASSWORD);
        return NextResponse.json({ success: true, user: authResponse.data });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (loginError) {
        return NextResponse.json({ success: false, error: 'Erro no auto-login' });
      }
    } else {
      // Regular authentication
      if (!username || !password) {
        throw new Error('Username e password são obrigatórios');
      }

      try {
        const authResponse = await login(username, password);
        return NextResponse.json({ success: true, user: authResponse.data });
      } catch (loginError) {
        throw new Error(`Erro na autenticação: ${loginError instanceof Error ? loginError.message : 'Erro desconhecido'}`);
      }
    }
  } catch (error) {
    console.error('Erro detalhado no login:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      details: {
        timestamp: new Date().toISOString(),
        type: error instanceof Error ? error.name : 'UnknownError',
        stack: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.stack : null : undefined
      }
    }, { status: 401 });
  }
}