"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
// Componentes removidos - usaremos inputs HTML nativos
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSuppliers } from "@/app/hooks/suppliers/useSuppliers";
import { useServices } from "@/app/hooks/suppliers/useServices";
import { CreateSupplierRequest, Jurisdicao } from "@/types/supplier.types";
import { useAuthContext } from "@/app/contexts/authContext";
import { SupplierServicesSelection } from "@/components/supplierServicesSelection";

const formSchema = z
  .object({
    nome_fantasia: z.string().min(1, "Nome fantasia é obrigatório"),
    jurisdicao: z.enum(["BRASIL", "SAN_ANDRES"], {
      required_error: "Jurisdição é obrigatória",
    }),

    // Campos Brasil
    cnpj: z.string().optional(),
    razao_social: z.string().optional(),
    inscricao_estadual: z.string().optional(),

    // Campos San Andres
    tax_id: z.string().optional(),
    registro_san: z.string().optional(),
    license_number: z.string().optional(),
    tipo_atividade: z.string().optional(),

    // Campos comuns
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    telefone: z.string().optional(),
    endereco: z.string().optional(),

    // Services
    service_ids: z.array(z.number()).optional(),
  })
  .refine(
    (data) => {
      if (data.jurisdicao === "BRASIL") {
        return data.cnpj && data.cnpj.length > 0;
      }
      return true;
    },
    {
      message: "CNPJ é obrigatório para fornecedores do Brasil",
      path: ["cnpj"],
    }
  )
  .refine(
    (data) => {
      if (data.jurisdicao === "SAN_ANDRES") {
        return data.tax_id && data.tax_id.length > 0;
      }
      return true;
    },
    {
      message: "Tax ID é obrigatório para fornecedores de San Andres",
      path: ["tax_id"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

export default function NewSupplierPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const { createSupplier } = useSuppliers();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome_fantasia: "",
      jurisdicao: "BRASIL",
      cnpj: "",
      razao_social: "",
      inscricao_estadual: "",
      tax_id: "",
      registro_san: "",
      license_number: "",
      tipo_atividade: "",
      email: "",
      telefone: "",
      endereco: "",
      service_ids: [],
    },
  });

  const watchedJurisdicao = form.watch("jurisdicao");

  // // Verificar se o usuário tem permissão para criar suppliers
  // if (!user || (user.id_position !== 1 && user.id_position !== 2)) {
  //   return (
  //     <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
  //       <Sidebar />
  //       <div className="flex flex-col items-center justify-center h-96">
  //         <h1 className="text-2xl font-bold text-red-600 mb-4">
  //           Acesso Negado
  //         </h1>
  //         <p className="text-gray-600">
  //           Você não tem permissão para acessar esta página.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      const supplierData: CreateSupplierRequest = {
        nome_fantasia: values.nome_fantasia,
        jurisdicao: values.jurisdicao as Jurisdicao,
        email: values.email || undefined,
        telefone: values.telefone || undefined,
        endereco: values.endereco || undefined,
        service_ids: values.service_ids || undefined,
      };

      if (values.jurisdicao === "BRASIL") {
        supplierData.cnpj = values.cnpj;
        supplierData.razao_social = values.razao_social;
        supplierData.inscricao_estadual = values.inscricao_estadual;
      } else {
        supplierData.tax_id = values.tax_id;
        supplierData.registro_san = values.registro_san;
        supplierData.license_number = values.license_number;
        supplierData.tipo_atividade = values.tipo_atividade;
      }

      await createSupplier(supplierData);
      localStorage.setItem(
        "SupplierSuccessMessage",
        "Fornecedor criado com sucesso!"
      );
      router.push("/suppliers");
    } catch (error) {
      console.error("Erro ao criar fornecedor:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleServiceToggle(serviceId: number, isSelected: boolean) {
    const currentServices = form.getValues("service_ids") || [];
    if (isSelected) {
      const newServices = [...currentServices, serviceId];
      form.setValue("service_ids", newServices);
      setSelectedServices(newServices);
    } else {
      const newServices = currentServices.filter((id) => id !== serviceId);
      form.setValue("service_ids", newServices);
      setSelectedServices(newServices);
    }
  }

  return (
    <ProtectedRoute>
      <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
        <Sidebar />

        <div className="mb-4 flex flex-row justify-between">
          <h1 className="text-2xl font-bold">Novo Fornecedor</h1>
          <Link href="/suppliers">
            <Button className="mb-4 cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para fornecedores
            </Button>
          </Link>
        </div>

        <Card className="w-full ">
          <CardHeader>
            <CardTitle>Informações do Fornecedor</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Seleção de Jurisdição */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Jurisdição</Label>
                <div className="flex flex-row space-x-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="brasil"
                      name="jurisdicao"
                      value="BRASIL"
                      checked={watchedJurisdicao === "BRASIL"}
                      onChange={(e) => {
                        form.setValue("jurisdicao", "BRASIL");
                        // Limpar campos da outra jurisdição
                        form.setValue("tax_id", "");
                        form.setValue("registro_san", "");
                        form.setValue("license_number", "");
                        form.setValue("tipo_atividade", "");
                      }}
                      className="w-4 h-4 text-blue-600"
                    />
                    <Label htmlFor="brasil">Brasil</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="san_andres"
                      name="jurisdicao"
                      value="SAN_ANDRES"
                      checked={watchedJurisdicao === "SAN_ANDRES"}
                      onChange={(e) => {
                        form.setValue("jurisdicao", "SAN_ANDRES");
                        // Limpar campos da outra jurisdição
                        form.setValue("cnpj", "");
                        form.setValue("razao_social", "");
                        form.setValue("inscricao_estadual", "");
                      }}
                      className="w-4 h-4 text-blue-600"
                    />
                    <Label htmlFor="san_andres">San Andres</Label>
                  </div>
                </div>
              </div>

              {/* Campos Comuns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome_fantasia">Nome Fantasia *</Label>
                  <Input
                    id="nome_fantasia"
                    {...form.register("nome_fantasia")}
                    placeholder="Nome fantasia do fornecedor"
                  />
                  {form.formState.errors.nome_fantasia && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.nome_fantasia.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    placeholder="email@exemplo.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    {...form.register("telefone")}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    {...form.register("endereco")}
                    placeholder="Endereço completo"
                  />
                </div>
              </div>

              {/* Campos específicos por jurisdição */}
              {watchedJurisdicao === "BRASIL" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informações Brasil</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cnpj">CNPJ *</Label>
                      <Input
                        id="cnpj"
                        {...form.register("cnpj")}
                        placeholder="00.000.000/0001-00"
                      />
                      {form.formState.errors.cnpj && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.cnpj.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="razao_social">Razão Social</Label>
                      <Input
                        id="razao_social"
                        {...form.register("razao_social")}
                        placeholder="Razão social da empresa"
                      />
                    </div>

                    <div>
                      <Label htmlFor="inscricao_estadual">
                        Inscrição Estadual
                      </Label>
                      <Input
                        id="inscricao_estadual"
                        {...form.register("inscricao_estadual")}
                        placeholder="Inscrição estadual"
                      />
                    </div>
                  </div>
                </div>
              )}

              {watchedJurisdicao === "SAN_ANDRES" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Informações San Andres
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tax_id">Tax ID *</Label>
                      <Input
                        id="tax_id"
                        {...form.register("tax_id")}
                        placeholder="Tax ID"
                      />
                      {form.formState.errors.tax_id && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.tax_id.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="registro_san">Registro San</Label>
                      <Input
                        id="registro_san"
                        {...form.register("registro_san")}
                        placeholder="Registro San"
                      />
                    </div>

                    <div>
                      <Label htmlFor="license_number">License Number</Label>
                      <Input
                        id="license_number"
                        {...form.register("license_number")}
                        placeholder="License number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="tipo_atividade">Tipo de Atividade</Label>
                      <Input
                        id="tipo_atividade"
                        {...form.register("tipo_atividade")}
                        placeholder="Tipo de atividade"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Seleção de Serviços */}
              <SupplierServicesSelection
                selectedServiceIds={selectedServices}
                onServiceToggle={handleServiceToggle}
              />

              {/* Botões */}
              <div className="flex gap-4 flex-row justify-between">
                <Link href="/suppliers">
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
                  {isLoading ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
