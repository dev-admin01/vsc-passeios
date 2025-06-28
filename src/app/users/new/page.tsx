"use client";

import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useCreateUser } from "@/app/hooks/users/useUsers";
import { User } from "@/types/user.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
    id_position: z.number().min(1),
    ddi: z.string().optional(),
    ddd: z.string().optional(),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export default function NewUserPage() {
  const router = useRouter();
  const { createUser, isLoading } = useCreateUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      id_position: 1,
      ddi: "",
      ddd: "",
      phone: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const userData: Omit<User, "id_user" | "created_at" | "updated_at"> = {
        name: values.name,
        email: values.email,
        password: values.password,
        id_position: values.id_position,
        ddi: values.ddi || null,
        ddd: values.ddd || null,
        phone: values.phone || null,
      };

      await createUser(userData);

      localStorage.setItem("userSuccessMessage", "Usuário criado com sucesso!");
      router.push("/users");
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
    }
  }

  return (
    <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
      <Sidebar />

      <div className="mb-4 flex flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">Criar novo usuário</h1>
        <Link href="/users">
          <Button variant="outline" className="mb-4 cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para usuários
          </Button>
        </Link>
      </div>

      <Card className="max-w">
        <CardHeader>
          <CardTitle>Dados do usuário</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row flex-wrap">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-row flex-wrap"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/2 md:pe-4 mb-4">
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/2">
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/2 md:pe-4 mb-4">
                    <FormLabel>Senha *</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/2 mb-4">
                    <FormLabel>Confirmar senha *</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ddi"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/4 pe-4 mb-4">
                    <FormLabel>DDI</FormLabel>
                    <FormControl>
                      <Input placeholder="55" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ddd"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/4 pe-4 mb-4">
                    <FormLabel>DDD</FormLabel>
                    <FormControl>
                      <Input placeholder="11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/4 pe-4 mb-4">
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="99999-9999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="id_position"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/4 mb-4">
                    <FormLabel>Posição</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione uma posição" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        <SelectItem value="1">Vendedor</SelectItem>
                        <SelectItem value="2">Gerente</SelectItem>
                        <SelectItem value="3">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full flex justify-between gap-2 pt-4">
                <Link href="/users">
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                  >
                    Cancelar
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Salvando..." : "Salvar usuário"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
