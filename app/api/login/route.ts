import { login } from '@/services/authService';
import { NextRequest, NextResponse } from 'next/server';

const AUTO_LOGIN_USERNAME = process.env.AUTO_LOGIN_USERNAME || '';
const AUTO_LOGIN_PASSWORD = process.env.AUTO_LOGIN_PASSWORD || '';

export async function POST(request: NextRequest) {
  try {
    const { username, password, isTvBrowser } = await request.json();
    try {
      const authResponse = await login(username, password);
      return NextResponse.json({ success: true, user: authResponse.data });
    } catch (loginError) {
      throw new Error(
        `Erro na autenticação: ${
          loginError instanceof Error ? loginError.message : 'Erro desconhecido'
        }`,
      );
    }
  } catch (error) {
    console.error('Erro detalhado no login:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        details: {
          timestamp: new Date().toISOString(),
          type: error instanceof Error ? error.name : 'UnknownError',
          stack:
            process.env.NODE_ENV === 'development'
              ? error instanceof Error
                ? error.stack
                : null
              : undefined,
        },
      },
      { status: 401 },
    );
  }
}
