"use client";

// import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sidebar } from "@/components/sidebar";
import { useCustomer } from "@/app/hooks/costumer/useCostumer";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Customer } from "@/types/customer.types";

const formatPhoneNumber = (
  ddd: string | undefined,
  phone: string | undefined,
) => {
  if (!ddd || !phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{5})(\d{4})$/);
  if (match) {
    return `(${ddd}) ${match[1]}-${match[2]}`;
  }
  return `(${ddd}) ${phone}`;
};

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [perpage] = useState(10);
  const [search, setSearch] = useState("");
  const { useCustomers, deleteCustomer } = useCustomer();
  const { data, error, isLoading, mutate } = useCustomers(
    page,
    perpage,
    search,
  );
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const message = localStorage.getItem("CustomerSuccessMessage");
    if (message) {
      toast.success(message);
      localStorage.removeItem("CustomerSuccessMessage");
    }
  }, []);

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
    setCustomerToDelete(id);
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
    setCustomerToDelete(null);
  }

  async function handleConfirmDelete() {
    if (customerToDelete) {
      setIsDeleting(true);
      try {
        await deleteCustomer(customerToDelete);
        mutate();
        closeDeleteModal();
      } catch (error) {
        console.error("Erro ao deletar cliente:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  }

  return (
    <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
      <Sidebar />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clientes</h1>

        <div className="flex items-center gap-2 mb-4">
          <Input
            type="text"
            placeholder="Buscar clientes..."
            value={search}
            onChange={handleSearchChange}
            className="bg-amber-50"
          />
          <Link href="/customers/new">
            <Button className="cursor-pointer">Adicionar Cliente</Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Erro ao carregar clientes
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !error && data?.customers?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Nenhum cliente cadastrado
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              !error &&
              data?.customers?.map((customer: Customer) => (
                <TableRow key={customer.id_customer}>
                  <TableCell>{customer.nome}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    {formatPhoneNumber(customer.ddd, customer.telefone)}
                  </TableCell>
                  <TableCell>
                    {new Date(customer.created_at || "").toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/customers/view/${customer.id_customer}`}>
                      <Button
                        variant="ghost"
                        title="Visualizar"
                        className="cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/customers/update/${customer.id_customer}`}>
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
                      onClick={() =>
                        openDeleteModal(customer.id_customer || "")
                      }
                      title="Excluir"
                      className="cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
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
            <p>Tem certeza que deseja excluir este cliente?</p>
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
  );
}
