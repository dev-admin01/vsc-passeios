"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Edit,
  Building,
  Globe,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useSuppliers } from "@/app/hooks/suppliers/useSuppliers";
import { Supplier, Jurisdicao } from "@/types/supplier.types";
import { useAuthContext } from "@/app/contexts/authContext";

interface ViewSupplierPageProps {
  params: Promise<{ id_supplier: string }>;
}

export default function ViewSupplierPage({ params }: ViewSupplierPageProps) {
  const { user } = useAuthContext();
  const { getSupplier } = useSuppliers();

  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supplierId, setSupplierId] = useState<string>("");

  useEffect(() => {
    async function loadSupplierData() {
      try {
        const resolvedParams = await params;
        setSupplierId(resolvedParams.id_supplier);

        const supplierData = await getSupplier(resolvedParams.id_supplier);

        if (supplierData) {
          setSupplier(supplierData);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do fornecedor:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSupplierData();
  }, [params, getSupplier]);

  // Verificar se o usuário tem permissão para visualizar suppliers
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

  if (isLoading) {
    return (
      <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
        <Sidebar />
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-gray-600">Carregando dados do fornecedor...</p>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
        <Sidebar />
        <div className="flex flex-col items-center justify-center h-96">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Fornecedor não encontrado
          </h1>
          <p className="text-gray-600">
            O fornecedor solicitado não foi encontrado.
          </p>
        </div>
      </div>
    );
  }

  function formatDocument() {
    if (!supplier) return "N/A";
    if (supplier.jurisdicao === Jurisdicao.BRASIL) {
      return supplier.cnpj ? `CNPJ: ${supplier.cnpj}` : "N/A";
    }
    return supplier.tax_id ? `Tax ID: ${supplier.tax_id}` : "N/A";
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
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Detalhes do Fornecedor</h1>
            <Link href={`/suppliers/update/${supplierId}`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl">
          {/* Informações Principais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informações Principais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Nome Fantasia
                </label>
                <p className="text-lg font-semibold">
                  {supplier.nome_fantasia}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  Jurisdição
                </label>
                <p className="text-lg">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      supplier.jurisdicao === Jurisdicao.BRASIL
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {supplier.jurisdicao === Jurisdicao.BRASIL
                      ? "Brasil"
                      : "San Andres"}
                  </span>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Documento
                </label>
                <p className="text-lg">{formatDocument()}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Data de Cadastro
                </label>
                <p className="text-lg">
                  {new Date(supplier.data_cadastro).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Informações de Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <p className="text-lg">{supplier.email || "N/A"}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  Telefone
                </label>
                <p className="text-lg">{supplier.telefone || "N/A"}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Endereço
                </label>
                <p className="text-lg">{supplier.endereco || "N/A"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Informações Específicas Brasil */}
          {supplier.jurisdicao === Jurisdicao.BRASIL && (
            <Card>
              <CardHeader>
                <CardTitle>Informações Brasil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    CNPJ
                  </label>
                  <p className="text-lg">{supplier.cnpj || "N/A"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Razão Social
                  </label>
                  <p className="text-lg">{supplier.razao_social || "N/A"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Inscrição Estadual
                  </label>
                  <p className="text-lg">
                    {supplier.inscricao_estadual || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informações Específicas San Andres */}
          {supplier.jurisdicao === Jurisdicao.SAN_ANDRES && (
            <Card>
              <CardHeader>
                <CardTitle>Informações San Andres</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Tax ID
                  </label>
                  <p className="text-lg">{supplier.tax_id || "N/A"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Registro San
                  </label>
                  <p className="text-lg">{supplier.registro_san || "N/A"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    License Number
                  </label>
                  <p className="text-lg">{supplier.license_number || "N/A"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Tipo de Atividade
                  </label>
                  <p className="text-lg">{supplier.tipo_atividade || "N/A"}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Serviços Oferecidos */}
          {supplier.service_supplier &&
            supplier.service_supplier.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Serviços Oferecidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {supplier.service_supplier.map((serviceSupplier) => (
                      <div
                        key={serviceSupplier.id_service_supplier}
                        className="p-3 border rounded-lg bg-gray-50"
                      >
                        <h4 className="font-medium">
                          {serviceSupplier.service?.description}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Tipo: {serviceSupplier.service?.type}
                        </p>
                        <p className="text-sm text-gray-600">
                          Preço: R$ {serviceSupplier.service?.price}
                        </p>
                        <p className="text-sm text-gray-600">
                          Duração: {serviceSupplier.service?.time}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
