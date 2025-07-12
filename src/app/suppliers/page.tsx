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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useSuppliers } from "@/app/hooks/suppliers/useSuppliers";
import { Supplier, Jurisdicao } from "@/types/supplier.types";
import { useAuthContext } from "@/app/contexts/authContext";

export default function SuppliersPage() {
  const { user } = useAuthContext();
  const [page, setPage] = useState(1);
  const [perpage] = useState(10);
  const [search, setSearch] = useState("");

  const { useSuppliersData, deleteSupplier } = useSuppliers();
  const { data, error, isLoading, mutate } = useSuppliersData(
    page,
    perpage,
    search,
  );

  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const message = localStorage.getItem("SupplierSuccessMessage");
    if (message) {
      toast.success(message);
      localStorage.removeItem("SupplierSuccessMessage");
    }
  }, []);

  // Verificar se o usuário tem permissão para acessar suppliers
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

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  function previousPage() {
    if (page > 1) setPage(page - 1);
  }

  function nextPage() {
    if (data && page < data.lastPage) setPage(page + 1);
  }

  function openDeleteModal(id: string) {
    setSupplierToDelete(id);
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
    setSupplierToDelete(null);
  }

  async function handleConfirmDelete() {
    if (supplierToDelete) {
      setIsDeleting(true);
      try {
        await deleteSupplier(supplierToDelete);
        mutate();
        closeDeleteModal();
      } catch (error) {
        console.error("Erro ao deletar fornecedor:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  }

  function formatDocument(supplier: Supplier) {
    if (supplier.jurisdicao === Jurisdicao.BRASIL) {
      return supplier.cnpj ? `CNPJ: ${supplier.cnpj}` : "N/A";
    }
    return supplier.tax_id ? `Tax ID: ${supplier.tax_id}` : "N/A";
  }

  function formatPhone(phone?: string | null) {
    return phone || "N/A";
  }

  return (
    <ProtectedRoute>
      <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
        <Sidebar />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Fornecedores</h1>

          <div className="flex items-center gap-2 mb-4">
            <Input
              type="text"
              placeholder="Buscar fornecedores..."
              value={search}
              onChange={handleSearchChange}
              className="bg-amber-50"
            />
            <Link href="/suppliers/new">
              <Button className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Novo Fornecedor
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome Fantasia</TableHead>
                <TableHead>Jurisdição</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Carregando...
                  </TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Erro ao carregar fornecedores
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !error && data?.suppliers?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Nenhum fornecedor cadastrado
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                !error &&
                data?.suppliers?.map((supplier: Supplier) => (
                  <TableRow key={supplier.id_supplier}>
                    <TableCell>{supplier.nome_fantasia}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>{formatDocument(supplier)}</TableCell>
                    <TableCell>{supplier.email || "N/A"}</TableCell>
                    <TableCell>{formatPhone(supplier.telefone)}</TableCell>
                    <TableCell>
                      {new Date(supplier.data_cadastro).toLocaleDateString(
                        "pt-BR",
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/suppliers/view/${supplier.id_supplier}`}>
                          <Button
                            variant="ghost"
                            title="Visualizar"
                            className="cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link
                          href={`/suppliers/update/${supplier.id_supplier}`}
                        >
                          <Button
                            variant="ghost"
                            title="Editar"
                            className="cursor-pointer"
                          >
                            <Pencil className="h-4 w-4 text-blue-500" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          onClick={() => openDeleteModal(supplier.id_supplier)}
                          title="Excluir"
                          className="cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {data && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <Button onClick={previousPage} disabled={page <= 1}>
                Anterior
              </Button>
              <span>
                Página {data.page} de {data.lastPage}
              </span>
              <Button onClick={nextPage} disabled={page >= data.lastPage}>
                Próxima
              </Button>
            </div>
          )}
        </div>

        {/* Modal de confirmação de exclusão */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white p-4 rounded shadow-md max-w-md w-full">
              <h3 className="text-lg font-bold mb-2">Confirmar Exclusão</h3>
              <p>Tem certeza que deseja excluir este fornecedor?</p>
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={closeDeleteModal}
                  className="cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="cursor-pointer"
                >
                  {isDeleting ? "Excluindo..." : "Excluir"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
