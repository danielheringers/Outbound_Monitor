import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/services/authService';

const AUTO_LOGIN_USERNAME = process.env.AUTO_LOGIN_USERNAME || '';
const AUTO_LOGIN_PASSWORD = 'U2FsdGVkX18wdMex2cArMVVhEioZ9qzH/ADFZFIw5rg='
const TV_IDENTIFIER = 'TV_ppwsy6v6r';

export async function POST(request: NextRequest) {
  try {
    const { username, password, isTvBrowser, tvIdentifier } = await request.json();

    console.log('Login attempt:', {
      isTvBrowser,
      tvIdentifier,
      hasUsername: !!username,
      hasPassword: !!password,
      hasAutoLogin: !!AUTO_LOGIN_USERNAME && !!AUTO_LOGIN_PASSWORD,
      expectedTvId: TV_IDENTIFIER
    });

    if (isTvBrowser) {
      if (!tvIdentifier) {
        throw new Error('TV Identifier não fornecido');
      }

      if (tvIdentifier !== TV_IDENTIFIER) {
        throw new Error(`TV Identifier inválido: ${tvIdentifier}`);
      }

      if (!AUTO_LOGIN_USERNAME || !AUTO_LOGIN_PASSWORD) {
        throw new Error('Credenciais de auto-login não configuradas');
      }

      try {
        const authResponse = await login(AUTO_LOGIN_USERNAME, AUTO_LOGIN_PASSWORD);
        return NextResponse.json({ success: true, user: authResponse.data });
      } catch (loginError) {
        throw new Error(`Erro no auto-login: ${loginError instanceof Error ? loginError.message : 'Erro desconhecido'}`);
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