"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Calendar, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/app/hooks/users/useUsers";

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const [id, setId] = useState<string>("");

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  const { data: user, error, isLoading } = useUser(id);

  function formatPhone(
    ddi?: string | null,
    ddd?: string | null,
    phone?: string | null,
  ) {
    if (!phone) return "Não informado";

    let formatted = "";
    if (ddi) formatted += `+${ddi} `;
    if (ddd) formatted += `(${ddd}) `;
    formatted += phone;

    return formatted;
  }

  function getPositionName(id_position?: number) {
    switch (id_position) {
      case 1:
        return "Vendedor";
      case 2:
        return "Gerente";
      case 3:
        return "Administrador";
      default:
        return "Não definido";
    }
  }

  if (isLoading) {
    return (
      <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
        <Sidebar />
        <div className="flex items-center justify-center h-64">
          <p>Carregando dados do usuário...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
        <Sidebar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Usuário não encontrado</p>
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
        <h1 className="text-2xl font-bold">Detalhes do usuário</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        {/* Informações principais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Nome</label>
              <p className="text-lg font-semibold">{user.name}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <p className="text-lg">{user.email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Posição
              </label>
              <p className="text-lg">{getPositionName(user.id_position)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Telefone
              </label>
              <p className="text-lg">
                {formatPhone(user.ddi, user.ddd, user.phone)}
              </p>
            </div>

            {user.ddi && (
              <div>
                <label className="text-sm font-medium text-gray-600">DDI</label>
                <p className="text-lg">+{user.ddi}</p>
              </div>
            )}

            {user.ddd && (
              <div>
                <label className="text-sm font-medium text-gray-600">DDD</label>
                <p className="text-lg">({user.ddd})</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informações do sistema */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Informações do sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  ID do usuário
                </label>
                <p className="text-lg font-mono bg-gray-100 p-2 rounded">
                  {user.id_user}
                </p>
              </div>

              {user.created_at && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Criado em
                  </label>
                  <p className="text-lg">
                    {new Date(user.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}

              {user.updated_at && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Última atualização
                  </label>
                  <p className="text-lg">
                    {new Date(user.updated_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações */}
      <div className="flex gap-2 mt-6">
        <Link href={`/users/update/${user.id_user}`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Editar usuário
          </Button>
        </Link>
        <Link href="/users">
          <Button variant="outline">Voltar para lista</Button>
        </Link>
      </div>
    </div>
  );
}
