import { api } from "@/services/api";

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

      console.log(response.data);
    } catch (error) {
      console.log(error);
      return;
    }

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
