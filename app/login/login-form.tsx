'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTvBrowser, setIsTvBrowser] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if the current browser is a TV browser
    const checkTvBrowser = () => {
      // This is a simple check. You might need a more sophisticated method
      const userAgent = navigator.userAgent.toLowerCase();
      return /smart-tv|smarttv|googletv|appletv|hbbtv|pov_tv|netcast.tv/.test(userAgent);
    };

    setIsTvBrowser(checkTvBrowser());

    // If it's a TV browser, attempt login immediately
    if (checkTvBrowser()) {
      handleSubmit();
    }
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password,
          isTvBrowser: isTvBrowser,
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
      toast({
        title: "Erro de autenticação",
        description: `Falha no login: ${error}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isTvBrowser) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <p className="text-center">Realizando login automático...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Entre com suas credenciais para acessar o dashboard.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
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
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}