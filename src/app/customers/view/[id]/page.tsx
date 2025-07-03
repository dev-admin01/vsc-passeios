"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Edit } from "lucide-react";
import { useCustomer } from "@/app/hooks/costumer/useCostumer";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ViewCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [customerLoading, setCustomerLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);
  const { getCustomer } = useCustomer();

  useEffect(() => {
    const loadCustomer = async () => {
      setCustomerLoading(true);
      try {
        const response = await getCustomer(resolvedParams.id);
        const customerData = response.costumer;
        if (customerData) {
          setCustomer(customerData);
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
  }, [resolvedParams.id, router, getCustomer]);

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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Detalhes do Cliente</h1>
        <div className="flex gap-2">
          <Link href={`/customers/update/${resolvedParams.id}`}>
            <Button className="bg-sky-300 hover:bg-sky-800 text-black cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
          <Link href="/customers" title="Voltar">
            <Button className="cursor-pointer">
              <ArrowLeft />
            </Button>
          </Link>
        </div>
      </div>

      <Card className="w-full">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">
                Informações Pessoais
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Nome</p>
                  <p className="font-medium">{customer?.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{customer?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">CPF/CNPJ</p>
                  <p className="font-medium">{customer?.cpf_cnpj}</p>
                </div>
                {customer?.passaporte && (
                  <div>
                    <p className="text-sm text-gray-500">Passaporte</p>
                    <p className="font-medium">{customer.passaporte}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Contato</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="font-medium">
                    +{customer?.ddi} ({customer?.ddd}) {customer?.telefone}
                  </p>
                </div>
                {customer?.indicacao && (
                  <div>
                    <p className="text-sm text-gray-500">Indicação</p>
                    <p className="font-medium">{customer.indicacao}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
