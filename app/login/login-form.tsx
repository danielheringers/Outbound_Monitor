"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const token = process.env.NEXT_PUBLIC_API_TOKEN!;
    const xApiKey = process.env.NEXT_PUBLIC_X_API_KEY!;

    if (password === "22072025") {
      Cookies.set("token", token, { expires: 1 });
      Cookies.set("x-api-key", xApiKey, { expires: 1 });
      console.log(token, xApiKey);
      toast({
        title: "Login bem-sucedido",
        description: "Redirecionando para a página principal...",
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
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
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
            <Button type="submit" className="w-full mt-4">
              Entrar
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
