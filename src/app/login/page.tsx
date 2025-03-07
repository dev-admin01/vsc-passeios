"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(event: FormEvent) {
    // Se estiver usando <form>, previna o comportamento padrão (recarregar página)
    event.preventDefault();

    // Chama a função de login do contexto
    // await signIn(email, password);
    alert("login");

    // Depois disso, redirecione, navegue, etc. Exemplo:
    // Router.push("/dashboard") ou algo assim
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-sm mx-5">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Entre na sua conta</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="password">Senha</Label>
              <Input
                type="password"
                id="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit">Entrar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
