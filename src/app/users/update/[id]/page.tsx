"use client";

import { useState, useEffect } from "react";
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
import { useUser, useUpdateUser } from "@/app/hooks/users/useUsers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    id_position: z.number().min(1),
    ddi: z.string().optional(),
    ddd: z.string().optional(),
    phone: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        if (data.password.length < 6) {
          return false;
        }
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message:
        "Senha deve ter pelo menos 6 caracteres e as senhas devem coincidir",
      path: ["confirmPassword"],
    },
  );

type FormValues = z.infer<typeof formSchema>;

interface UpdateUserPageProps {
  params: Promise<{ id: string }>;
}

export default function UpdateUserPage({ params }: UpdateUserPageProps) {
  const router = useRouter();
  const [id, setId] = useState<string>("");

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  const { data: user, error, isLoading: isLoadingUser } = useUser(id);
  const { updateUser, isLoading: isUpdating } = useUpdateUser();

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

  // Preenche o formulário quando os dados do usuário carregam
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
        id_position: user.id_position || 1,
        ddi: user.ddi || "",
        ddd: user.ddd || "",
        phone: user.phone || "",
      });
    }
  }, [user, form]);

  async function onSubmit(values: FormValues) {
    try {
      const userData: any = {
        name: values.name,
        email: values.email,
        id_position: values.id_position,
        ddi: values.ddi || null,
        ddd: values.ddd || null,
        phone: values.phone || null,
      };

      // Só inclui a senha se foi preenchida
      if (values.password && values.password.length > 0) {
        userData.password = values.password;
      }

      await updateUser(id, userData);

      localStorage.setItem(
        "userSuccessMessage",
        "Usuário atualizado com sucesso!",
      );
      router.push("/users");
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    }
  }

  if (isLoadingUser) {
    return (
      <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
        <Sidebar />
        <div className="flex items-center justify-center h-64">
          <p>Carregando dados do usuário...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
        <Sidebar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Erro ao carregar usuário</p>
            <Link href="/users">
              <Button>Voltar para usuários</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
      <Sidebar />

      <div className="mb-4">
        <Link href="/users">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para usuários
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Editar usuário</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Dados do usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
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
                    <FormItem>
                      <FormLabel>Nova senha (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Deixe em branco para manter a atual"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar nova senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirme a nova senha"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ddi"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
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
                    <FormItem className="md:col-span-2">
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
                    <FormItem>
                      <FormLabel>Posição</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma posição" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Vendedor</SelectItem>
                          <SelectItem value="2">Gerente</SelectItem>
                          <SelectItem value="3">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isUpdating}>
                  <Save className="h-4 w-4 mr-2" />
                  {isUpdating ? "Salvando..." : "Salvar alterações"}
                </Button>
                <Link href="/users">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
