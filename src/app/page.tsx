"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useAuth } from "./hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      email === "" ||
      password === ""
    ) {
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result) {
      setStatusCode(result.statusCode);
    }
  }

  // Função para lidar com o evento de submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Impede o recarregamento da página
    const formData = new FormData(e.currentTarget);
    await handleLogin(formData);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-sky-100">
      <Card className="w-full max-w-sm mx-5">
        <CardHeader>
          <Image
            src="/logo.png"
            alt="Logo"
            width={100}
            height={100}
            className="mx-auto"
          />
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {statusCode === 400 && (
              <span className="text-red-500">Usuário ou senha invalidados</span>
            )}

            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                placeholder="Seu email"
                name="email"
                required
              />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="password">Senha</Label>
              <Input
                type="password"
                placeholder="Sua senha"
                name="password"
                required
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-t-2 border-white rounded-full"></span>
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
