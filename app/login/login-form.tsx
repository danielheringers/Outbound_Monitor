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

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTv, setIsTv] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Move browser detection to useEffect to avoid SSR issues
  useEffect(() => {
    setIsTv(isTvBrowser());
  }, []);

  // Separate useEffect for auto-login to avoid dependency issues
  useEffect(() => {
    if (isTv) {
      handleSubmit();
    }
  }, [isTv]); // Only trigger when isTv changes

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
        throw new Error(data.error || 'Falha na autenticação');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
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
            {error && (
              <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                Erro: {error}
              </div>
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
      
      {/* Debug information for TV */}
      {isTv && (
        <Card className="mt-4 bg-gray-100">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Informações de Debug</h3>
            <div className="space-y-1 text-sm">
              <p>Status: {isLoading ? 'Tentando login...' : error ? 'Erro' : 'Aguardando'}</p>
              {error && <p className="text-red-500">Erro: {error}</p>}
              <p>Modo TV: {isTv ? 'Sim' : 'Não'}</p>
              <p>User Agent: {typeof window !== 'undefined' ? window.navigator.userAgent : 'Não disponível'}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}