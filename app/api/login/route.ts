import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/services/authService';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    const authResponse = await login(username, password);
    return NextResponse.json({ success: true, user: authResponse.data });
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ error: 'Falha na autenticação' }, { status: 401 });
  }
}