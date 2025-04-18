import { cookies } from 'next/headers';

interface Tenants {
  enabled: boolean;
  updated_at: string;
  created_at: string;
  pk: string;
  name: string;
  tenantId: string;
  userIsAdmin: boolean;
}

interface AuthResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  expirationDate: string;
  data: {
    user_id: string;
    username: string;
    name: string;
    mainTenant: string;
    pk: string;
    tenants: Tenants[];
  };
}

export async function login(
  username: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch('https://api.orbitspot.com/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error('Falha na autenticação');
  }

  const data: AuthResponse = await response.json();

  cookies().set('token', data.token, { httpOnly: true, secure: true });
  cookies().set('x-api-key', '98e64e05-0565-42ee-94e4-d4e45b52a9f4', {
    httpOnly: true,
    secure: true,
  });

  return data;
}

export function getAuthCredentials() {
  const token = cookies().get('token')?.value;
  const xApiKey = cookies().get('x-api-key')?.value;

  if (!token || !xApiKey) {
    throw new Error('Credenciais de autenticação não encontradas');
  }

  return { token, xApiKey };
}
