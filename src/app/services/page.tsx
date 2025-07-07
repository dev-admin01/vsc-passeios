"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import { useService } from "@/app/hooks/services/useService";

import { Edit, Trash2 } from "lucide-react";

export default function ServicesPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const { useServices, deleteService } = useService();
  const { data, isLoading, error, mutate } = useServices(page, limit, search);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceIdToDelete, setServiceIdToDelete] = useState<number | null>(
    null,
  );

  function openDeleteModal(id: number) {
    setServiceIdToDelete(id);
    setIsDeleteModalOpen(true);
  }
  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
    setServiceIdToDelete(null);
  }
  async function handleConfirmDelete() {
    setIsDeleteLoading(true);

    if (serviceIdToDelete) {
      await deleteService(serviceIdToDelete);
      mutate();
    }

    closeDeleteModal();
    setIsDeleteLoading(false);
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }
  function previousPage() {
    if (page > 1) setPage((prev) => prev - 1);
  }
  function nextPage() {
    if (data && page < data.lastPage) {
      setPage((prev) => prev + 1);
    }
  }

  return (
    <ProtectedRoute>
      <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
        <Sidebar />
        <h1 className="text-2xl font-bold">Passeios</h1>

        <div className="flex items-center gap-2 mb-4">
          <Input
            type="text"
            placeholder="Buscar descrição..."
            value={search}
            onChange={handleSearchChange}
            className="bg-amber-50"
          />
          <Button className="cursor-pointer">
            <Link href="/services/new">Novo Passeio</Link>
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Observação</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5}>Carregando...</TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={5}>Erro ao carregar os passeios.</TableCell>
              </TableRow>
            )}
            {!isLoading && !error && data?.services?.length
              ? data.services.map((item: any) => (
                  <TableRow key={item.id_service}>
                    <TableCell>{item.id_service}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      {(() => {
                        let value = item.price;
                        if (value) {
                          value = value.toString().replace(/\D/g, "");
                          value = (parseInt(value, 10) / 100).toFixed(2);
                          value = value.replace(".", ",");
                          value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                          value = "R$ " + value;
                        }
                        return value;
                      })()}
                    </TableCell>
                    <TableCell>{item.observation}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          title="Editar"
                          className="cursor-pointer"
                        >
                          <Link href={`/services/update/${item.id_service}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => openDeleteModal(item.id_service)}
                          title="Excluir"
                          className="cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : !isLoading &&
                !error && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      Nenhum passeio encontrado.
                    </TableCell>
                  </TableRow>
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
        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white p-4 rounded shadow-md max-w-md w-full">
              <h3 className="text-lg font-bold mb-2">Confirmar Exclusão</h3>
              <p>Tem certeza que deseja excluir este Passeio?</p>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={closeDeleteModal}>
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmDelete}
                  disabled={isDeleteLoading}
                >
                  {isDeleteLoading ? "Excluindo..." : "Excluir"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
