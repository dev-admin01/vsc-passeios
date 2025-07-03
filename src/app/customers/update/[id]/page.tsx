"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CustomerFormData, useCustomerForm } from "../../customer-form";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCustomer } from "@/app/hooks/costumer/useCostumer";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UpdateCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const form = useCustomerForm();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const { updateCustomer, getCustomer } = useCustomer();

  useEffect(() => {
    const loadCustomer = async () => {
      setCustomerLoading(true);
      try {
        const response = await getCustomer(resolvedParams.id);
        const customer = response.costumer;

        // Preenche o formulário com os dados do cliente
        if (customer) {
          form.reset({
            nome: customer.nome,
            email: customer.email,
            cpf_cnpj: customer.cpf_cnpj,
            rg: customer.rg || "",
            ddi: customer.ddi,
            ddd: customer.ddd,
            telefone: customer.telefone,
            indicacao: customer.indicacao || "",
          });
        }
      } catch (error) {
        console.error("Erro ao carregar cliente:", error);
        toast.error("Erro ao carregar dados do cliente");
        router.push("/customers");
      } finally {
        setCustomerLoading(false);
      }
    };

    loadCustomer();
  }, [resolvedParams.id, form, router, getCustomer]);

  const onSubmit = async (data: CustomerFormData) => {
    setIsLoading(true);
    try {
      const response = await updateCustomer(resolvedParams.id, data);
      if (response) {
        router.push("/customers");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para formatar CPF
  function formatCPF(value: string) {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    } else if (numbers.length <= 9) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    } else {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
    }
  }

  function formatPhone(value: string): string {
    const numbers = value.replace(/\D/g, "");
    const limitedNumbers = numbers.slice(0, 9);

    if (limitedNumbers.length <= 1) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 5) {
      return `${limitedNumbers.slice(0, 1)} ${limitedNumbers.slice(1)}`;
    } else {
      return `${limitedNumbers.slice(0, 1)} ${limitedNumbers.slice(1, 5)}-${limitedNumbers.slice(5)}`;
    }
  }

  if (customerLoading) {
    return (
      <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
        <Sidebar />
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
      <Sidebar />
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-2">Editar Cliente</h1>
        <Link href="/customers" title="Voltar">
          <Button className="cursor-pointer">
            <ArrowLeft />
          </Button>
        </Link>
      </div>
      <div className="flex flex-col">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-wrap"
          >
            <Card className="w-full">
              <CardContent className="flex flex-wrap">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem className="mb-4 w-full sm:w-1/2 sm:pe-4">
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nome" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="mb-4 w-full sm:w-1/2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cpf_cnpj"
                  render={({ field }) => (
                    <FormItem className="mb-4 w-full sm:w-1/2 sm:pe-4">
                      <FormLabel>CPF/CNPJ</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="CPF/CNPJ"
                          onChange={(e) => {
                            const formatted = formatCPF(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rg"
                  render={({ field }) => (
                    <FormItem className="mb-4 w-full sm:w-1/2">
                      <FormLabel>RG</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="RG" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ddi"
                  render={({ field }) => (
                    <FormItem className="mb-4 w-full sm:w-1/4 sm:pe-4">
                      <FormLabel>DDI</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="DDI"
                          maxLength={2}
                          minLength={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ddd"
                  render={({ field }) => (
                    <FormItem className="mb-4 w-full sm:w-1/4 sm:pe-4">
                      <FormLabel>DDD</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="DDD"
                          maxLength={2}
                          minLength={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem className="mb-4 w-full sm:w-1/2">
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Telefone"
                          onChange={(e) => {
                            const formatted = formatPhone(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="indicacao"
                  render={({ field }) => (
                    <FormItem className="mb-4 w-full">
                      <FormLabel>Indicação (Opcional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Indicação" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-sky-300 hover:bg-sky-800 text-black disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Atualizando...
                    </>
                  ) : (
                    "Atualizar Cliente"
                  )}
                </Button>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
