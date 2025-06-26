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
import { useCustomer } from "@/app/hooks/costumer/ListCustomer";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { DeleteCustomerModal } from "@/components/deleteCustomerModal";
import { useDeleteCustomer } from "../hooks/costumer/useDeleteCustomer";
import Link from "next/link";
import { toast } from "sonner";

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
  const { data, error, isLoading, mutate } = useCustomer(page, perpage, search);
  const { deleteCustomer } = useDeleteCustomer();
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

  async function handleDelete() {
    if (customerToDelete) {
      setIsDeleting(true);
      try {
        await deleteCustomer(customerToDelete);
        mutate();
        setIsDeleteModalOpen(false);
        setCustomerToDelete(null);
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
          {isLoading && (
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            </TableBody>
          )}
          <TableBody>
            {error && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Erro ao carregar clientes
                </TableCell>
              </TableRow>
            )}
            {!isLoading && data?.customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Nenhum cliente cadastrado
                </TableCell>
              </TableRow>
            ) : (
              data?.customers.map((customer) => (
                <TableRow key={customer.id_costumer}>
                  <TableCell>{customer.nome}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    {formatPhoneNumber(customer.ddd, customer.telefone)}
                  </TableCell>
                  <TableCell>
                    {new Date(customer.created_at || "").toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/customers/view/${customer.id_costumer}`}>
                      <Button
                        variant="ghost"
                        title="Visualizar"
                        className="cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/customers/update/${customer.id_costumer}`}>
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
                        openDeleteModal(customer.id_costumer || "")
                      }
                      title="Excluir"
                      className="cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
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
      <DeleteCustomerModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
