"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import { Separator } from "@/components/ui/separator";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (password === "22072025") {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: process.env.NEXT_PUBLIC_EMAIL_LOGIN,
            password: process.env.NEXT_PUBLIC_PASSWORD_LOGIN,
          }),
        });

        const data = await response.json();

        if (data.success) {
          Cookies.set("token", data.token);
          Cookies.set("user", JSON.stringify(data.user));

          toast({
            title: "Login bem-sucedido",
            description: "Redirecionando para a página principal...",
          });
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        } else {
          throw new Error(data.error || "Falha no login");
        }
      } catch (err) {
        console.error("Erro ao fazer login:", err);
        toast({
          title: "Erro de autenticação",
          description: "Não foi possível autenticar. Tente novamente.",
        });
        return;
      }
    } else {
      toast({
        title: "Login falhou",
        description: "Senha incorreta. Tente novamente.",
      });
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader>
          <div className="flex flex-col items-center align-center">
            <h1 className="font-semibold text-2xl text-center">Login</h1>
            <Separator className="my-2 w-4" orientation="horizontal" />
            <p className="text-sm text-muted-foreground text-center">
              Acesso restrito. Insira a senha para continuar.
            </p>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="password">
                <span className="tracking-wide">Senha</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full font-bold">
              Entrar
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
