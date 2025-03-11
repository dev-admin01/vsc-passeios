import { api } from "@/services/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import axios from "axios";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Image from "next/image";

export default function LoginPage() {
  async function handleLogin(formData: FormData) {
    "use server";

    const email = formData.get("email");
    const password = formData.get("password");

    if (email === "" || password === "") {
      return;
    }

    try {
      const response = await api.post("/auth", {
        email,
        password,
      });

      if (!response.data.token) {
        return;
      }

      const expressTime = 60 * 60 * 24 * 7;

      const cookieStore = await cookies();

      cookieStore.set("vsc-session", response.data.token, {
        maxAge: expressTime,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Se a API retornou um erro "tratado" (por exemplo, 400), você pode ler o corpo de resposta:
        console.log(error.response?.data);

        // Se você quiser, pode exibir alguma mensagem de erro na tela:
        // setError(error.response?.data.message);
      } else {
        // Caso não seja um AxiosError, pode tratar de outra forma
        console.log(error);
      }
    }

    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen items-center justify-center">
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
          <form action={handleLogin} className="grid gap-4">
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

            <Button type="submit">Entrar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
