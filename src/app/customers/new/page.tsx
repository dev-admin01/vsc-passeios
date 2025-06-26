"use client";

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
import { CustomerFormData, useCustomerForm } from "../customer-form";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useCreateCustomer } from "@/app/hooks/costumer/useCreateCustomer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function NewCustomerPage() {
  const form = useCustomerForm();
  const { createCustomer } = useCreateCustomer();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: CustomerFormData) => {
    try {
      setIsLoading(true);
      const response = await createCustomer(data);

      localStorage.setItem(
        "CustomerSuccessMessage",
        response.message || "Cliente criado com sucesso!",
      );

      router.push("/customers");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para formatar CPF
  function formatCPF(value: string) {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");

    // Aplica a máscara de CPF (000.000.000-00)
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
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");

    // Limita a 9 dígitos
    const limitedNumbers = numbers.slice(0, 9);

    // Aplica a máscara (9 7527-4643)
    if (limitedNumbers.length <= 1) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 5) {
      return `${limitedNumbers.slice(0, 1)} ${limitedNumbers.slice(1)}`;
    } else {
      return `${limitedNumbers.slice(0, 1)} ${limitedNumbers.slice(1, 5)}-${limitedNumbers.slice(5)}`;
    }
  }

  return (
    <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
      <Sidebar />
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-2">Novo Cliente</h1>
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
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="CPF"
                          value={formatCPF(field.value || "")}
                          onChange={(e) => {
                            const formattedValue = formatCPF(e.target.value);
                            field.onChange(formattedValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passaporte"
                  render={({ field }) => (
                    <FormItem className="mb-4 w-full sm:w-1/2">
                      <FormLabel>Passaporte</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Passaporte" />
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
                          value={formatPhone(field.value || "")}
                          onChange={(e) => {
                            const formattedValue = formatPhone(e.target.value);
                            field.onChange(formattedValue);
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
                    <FormItem className="mb-4 w-full sm:w-1/2">
                      <FormLabel>Indicação</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Indicação" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-sky-300 hover:bg-sky-800 text-black"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Cliente"
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
