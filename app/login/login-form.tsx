'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

// Separate the browser check into a client-side utility
function isTvBrowser() {
  if (typeof window === 'undefined') return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /smart-tv|smarttv|googletv|appletv|hbbtv|pov_tv|netcast.tv/.test(userAgent);
}

function getTvIdentifier() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('tv_identifier');
}

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTv, setIsTv] = useState(false)
  const [tvIdentifier, setTvIdentifier] = useState<string | null>(null)
  const [userAgent, setUserAgent] = useState('Não disponível');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [error, setError] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserAgent(window.navigator.userAgent);
    }
  }, []);

  useEffect(() => {
    const tv = isTvBrowser();
    setIsTv(tv);
    if (tv) {
      const identifier = getTvIdentifier();
      setTvIdentifier(identifier);
    }
  }, []);

  useEffect(() => {
    if (isTv && tvIdentifier) {
      handleSubmit();
    }
  }, [isTv, tvIdentifier]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password,
          isTvBrowser: isTv,
          tvIdentifier: tvIdentifier,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Login bem-sucedido",
          description: "Redirecionando para a página principal...",
        });
        router.push('/dashboard');
      } else {
        setError(data);
        throw new Error(data.error || 'Falha na autenticação');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(error);
      toast({
        title: "Erro de autenticação",
        description: `Falha no login: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            {isTv ? 'Login automático para TV' : 'Entre com suas credenciais para acessar o dashboard.'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {!isTv && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="seu@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter>
            {!isTv && (
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
      
      {/* Debug information */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Informações de Debug</h3>
          <div className="space-y-2 text-sm">
            <p>Status: {isLoading ? 'Tentando login...' : error ? 'Erro' : 'Aguardando'}</p>
            <p>Modo TV: {isTv ? 'Sim' : 'Não'}</p>
            <p>TV Identifier: {tvIdentifier || 'Não disponível'}</p>
            <p>User Agent: {userAgent}</p>
            {error && (
              <div className="mt-4 p-3 rounded-md">
                <p className="font-semibold text-red-700">Detalhes do Erro:</p>
                <pre className="mt-2 whitespace-pre-wrap text-xs text-red-600">
                  {JSON.stringify(error)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}