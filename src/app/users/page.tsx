"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Edit,
  Trash2,
  Eye,
  UserPlus,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  useUsers,
  useDeleteUser,
  useToggleUser,
} from "@/app/hooks/users/useUsers";
import { DeleteUserModal } from "@/components/deleteUserModal";
import { User } from "@/types/user.types";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [perpage] = useState(10);
  const [search, setSearch] = useState("");

  const { data, error, isLoading, mutate } = useUsers(page, perpage, search);
  console.log("data no users page", data);
  const { deleteUser, isLoading: isDeleting } = useDeleteUser();
  const { toggleUser } = useToggleUser();

  // Modal state
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isToggleLoading, setIsToggleLoading] = useState<string | null>(null);

  useEffect(() => {
    const successMessage = localStorage.getItem("userSuccessMessage");
    if (successMessage) {
      toast.success(successMessage);
      localStorage.removeItem("userSuccessMessage");
    }
  }, []);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  function openDeleteModal(user: User) {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  }

  async function handleToggleActive(user: User) {
    if (!user.id_user) return;

    setIsToggleLoading(user.id_user);
    try {
      await toggleUser(user.id_user);
      mutate();
    } catch (error) {
      console.error("Erro ao alterar status do usuário:", error);
    } finally {
      setIsToggleLoading(null);
    }
  }

  async function handleDelete() {
    if (userToDelete?.id_user) {
      try {
        await deleteUser(userToDelete.id_user);
        mutate();
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      } catch (error) {
        console.error("Erro ao deletar usuário:", error);
      }
    }
  }

  function previousPage() {
    if (page > 1) setPage(page - 1);
  }

  function nextPage() {
    if (data && page < data.lastPage) setPage(page + 1);
  }

  function formatPhone(
    ddi?: string | null,
    ddd?: string | null,
    phone?: string | null,
  ) {
    if (!phone) return "N/A";

    let formatted = "";
    if (ddi) formatted += `+${ddi} `;
    if (ddd) formatted += `(${ddd}) `;
    formatted += phone;

    return formatted;
  }

  return (
    <ProtectedRoute>
      <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
        <Sidebar />
        <h1 className="text-2xl font-bold mb-4">Usuários</h1>

        {/* Busca + Botão Criar */}
        <div className="flex items-center gap-2 mb-4">
          <Input
            type="text"
            placeholder="Buscar usuários..."
            value={search}
            onChange={handleSearchChange}
            className="bg-amber-50"
          />
          <Link href="/users/new">
            <Button className="cursor-pointer">
              <UserPlus className="h-4 w-4 mr-2" />
              Novo usuário
            </Button>
          </Link>
        </div>

        {/* Tabela */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Criado em</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6}>Carregando...</TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={6}>Erro ao carregar usuários.</TableCell>
              </TableRow>
            )}
            {!isLoading && data?.users?.length
              ? data.users.map((user: User) => (
                  <TableRow key={user.id_user}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {formatPhone(user.ddi, user.ddd, user.phone)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.active ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString("pt-BR")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/users/${user.id_user}`}>
                          <Button
                            variant="ghost"
                            title="Visualizar"
                            className="cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Link href={`/users/update/${user.id_user}`}>
                          <Button
                            variant="ghost"
                            title="Editar"
                            className="cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          onClick={() => handleToggleActive(user)}
                          title={
                            user.active ? "Desativar usuário" : "Ativar usuário"
                          }
                          className="cursor-pointer"
                          disabled={isToggleLoading === user.id_user}
                        >
                          {user.active ? (
                            <ToggleRight className="h-4 w-4 text-green-500" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-red-500" />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          onClick={() => openDeleteModal(user)}
                          title="Excluir"
                          className="cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : !isLoading &&
                !error && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>

        {/* Paginação */}
        {data && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button onClick={previousPage} disabled={page <= 1}>
              Anterior
            </Button>
            <span>
              Página {data.page || page} de {data.lastPage || 1}
            </span>
            <Button onClick={nextPage} disabled={page >= (data.lastPage || 1)}>
              Próxima
            </Button>
          </div>
        )}

        {/* Modal de Exclusão */}
        <DeleteUserModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          isLoading={isDeleting}
        />
      </div>
    </ProtectedRoute>
  );
}
