"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSuppliers } from "@/app/hooks/suppliers/useSuppliers";
import { UpdateSupplierRequest, Jurisdicao } from "@/types/supplier.types";
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
    },
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
    },
  );

type FormValues = z.infer<typeof formSchema>;

interface UpdateSupplierPageProps {
  params: Promise<{ id_supplier: string }>;
}

export default function UpdateSupplierPage({
  params,
}: UpdateSupplierPageProps) {
  const { user } = useAuthContext();
  const router = useRouter();
  const { getSupplier, updateSupplier } = useSuppliers();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [supplierId, setSupplierId] = useState<string>("");
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
    },
  });

  const watchedJurisdicao = form.watch("jurisdicao");

  useEffect(() => {
    async function loadSupplierData() {
      try {
        const resolvedParams = await params;
        setSupplierId(resolvedParams.id_supplier);

        const supplierData = await getSupplier(resolvedParams.id_supplier);

        if (supplierData) {
          form.reset({
            nome_fantasia: supplierData.nome_fantasia,
            jurisdicao: supplierData.jurisdicao as "BRASIL" | "SAN_ANDRES",
            cnpj: supplierData.cnpj || "",
            razao_social: supplierData.razao_social || "",
            inscricao_estadual: supplierData.inscricao_estadual || "",
            tax_id: supplierData.tax_id || "",
            registro_san: supplierData.registro_san || "",
            license_number: supplierData.license_number || "",
            tipo_atividade: supplierData.tipo_atividade || "",
            email: supplierData.email || "",
            telefone: supplierData.telefone || "",
            endereco: supplierData.endereco || "",
          });

          // Carregar serviços selecionados
          if (supplierData.service_supplier) {
            const serviceIds = supplierData.service_supplier.map(
              (ss: any) => ss.id_service,
            );
            setSelectedServices(serviceIds);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do fornecedor:", error);
      } finally {
        setIsLoadingData(false);
      }
    }

    loadSupplierData();
  }, [params, getSupplier, form]);

  // Verificar se o usuário tem permissão para atualizar suppliers
  if (!user || (user.id_position !== 1 && user.id_position !== 2)) {
    return (
      <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
        <Sidebar />
        <div className="flex flex-col items-center justify-center h-96">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Acesso Negado
          </h1>
          <p className="text-gray-600">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  if (isLoadingData) {
    return (
      <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
        <Sidebar />
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-gray-600">Carregando dados do fornecedor...</p>
        </div>
      </div>
    );
  }

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      const supplierData: UpdateSupplierRequest = {
        nome_fantasia: values.nome_fantasia,
        jurisdicao: values.jurisdicao as Jurisdicao,
        email: values.email || undefined,
        telefone: values.telefone || undefined,
        endereco: values.endereco || undefined,
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

      // Incluir serviços selecionados
      if (selectedServices.length > 0) {
        supplierData.service_ids = selectedServices;
      }

      await updateSupplier(supplierId, supplierData);
      localStorage.setItem(
        "SupplierSuccessMessage",
        "Fornecedor atualizado com sucesso!",
      );
      router.push("/suppliers");
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleServiceToggle(serviceId: number, isSelected: boolean) {
    if (isSelected) {
      setSelectedServices((prev) => [...prev, serviceId]);
    } else {
      setSelectedServices((prev) => prev.filter((id) => id !== serviceId));
    }
  }

  return (
    <ProtectedRoute>
      <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
        <Sidebar />

        <div className="mb-4">
          <Link href="/suppliers">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para fornecedores
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Editar Fornecedor</h1>
        </div>

        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle>Informações do Fornecedor</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Seleção de Jurisdição */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Jurisdição</Label>
                <Select
                  value={watchedJurisdicao}
                  onValueChange={(value) => {
                    form.setValue(
                      "jurisdicao",
                      value as "BRASIL" | "SAN_ANDRES",
                    );
                    // Limpar campos da outra jurisdição
                    if (value === "BRASIL") {
                      form.setValue("tax_id", "");
                      form.setValue("registro_san", "");
                      form.setValue("license_number", "");
                      form.setValue("tipo_atividade", "");
                    } else {
                      form.setValue("cnpj", "");
                      form.setValue("razao_social", "");
                      form.setValue("inscricao_estadual", "");
                    }
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Selecione a jurisdição" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRASIL">Brasil</SelectItem>
                    <SelectItem value="SAN_ANDRES">San Andres</SelectItem>
                  </SelectContent>
                </Select>
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
              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Salvando..." : "Salvar"}
                </Button>
                <Link href="/suppliers">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
