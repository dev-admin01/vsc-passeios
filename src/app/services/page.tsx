"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/sidebar";

// Hooks existentes
import { useServices } from "@/app/hooks/useServices";
import { useCreateService } from "@/app/hooks/useCreateService";

// Novos hooks (edição / deleção / get único)
import { useDeleteService } from "@/app/hooks/useDeleteService";
import { useUpdateService } from "@/app/hooks/useUpdateService";
import { useGetService } from "@/app/hooks/useGetService";

// Ícones do lucide-react (instale via npm i lucide-react)
import { Edit, Trash2 } from "lucide-react";

// (Opcional) componente de criação que você já tem
import {
  CreateServiceModal,
  CreateServicePayload,
} from "@/components/createServiceModal";
interface ServiceData {
  id_service: number;
  description: string;
  type: string;
  price: string;
  observation: string;
  // etc
}

export default function ServicesPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isLoading, error, mutate } = useServices(page, limit, search);
  const { createService } = useCreateService();
  const { deleteService } = useDeleteService();
  const { getService } = useGetService();
  const { updateService } = useUpdateService();

  // ----- Modal de criação -----
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  function openCreateModal() {
    setIsCreateModalOpen(true);
  }
  function closeCreateModal() {
    setIsCreateModalOpen(false);
  }
  async function handleCreateService(payload: CreateServicePayload) {
    await createService(payload);
    mutate(); // Recarrega a lista
  }

  // ----- Modal de exclusão -----
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceIdToDelete, setServiceIdToDelete] = useState<number | null>(
    null
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
    if (serviceIdToDelete) {
      await deleteService(serviceIdToDelete);
      mutate(); // Atualiza a lista após exclusão
    }
    closeDeleteModal();
  }

  // ----- Modal de edição -----
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editServiceId, setEditServiceId] = useState<number | null>(null);

  // Campos do formulário de edição
  const [description, setDescription] = useState("");
  const [type, setType] = useState("0");
  const [price, setPrice] = useState("");
  const [observation, setObservation] = useState("");

  function openEditModal(id: number) {
    setEditServiceId(id);
    setIsEditModalOpen(true);
  }
  function closeEditModal() {
    setIsEditModalOpen(false);
    setEditServiceId(null);
    // limpamos os campos do form
    setDescription("");
    setType("0");
    setPrice("");
    setObservation("");
  }

  // Quando abrir o modal de edição, carregamos as infos do serviço
  useEffect(() => {
    if (isEditModalOpen && editServiceId) {
      (async () => {
        try {
          const serviceData: ServiceData = await getService(editServiceId);
          setDescription(serviceData.description);
          setType(serviceData.type);
          setPrice(serviceData.price);
          setObservation(serviceData.observation);
        } catch (err) {
          console.error("Erro ao buscar serviço:", err);
        }
      })();
    }
  }, [editServiceId, isEditModalOpen, getService]);

  async function handleUpdateService(e: FormEvent) {
    e.preventDefault();
    if (!editServiceId) return;

    const payload = {
      description,
      type,
      price,
      observation,
    };

    try {
      await updateService(editServiceId, payload);
      mutate(); // Recarrega a lista após edição
      closeEditModal();
    } catch (err) {
      console.error("Erro ao atualizar serviço:", err);
    }
  }

  // Paginação + Busca
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
    <div className="sm:ml-14 p-4">
      <Sidebar />
      <h1 className="text-2xl font-bold">Services</h1>

      {/* Busca + Criar */}
      <div className="flex items-center gap-2 mb-4">
        <Input
          type="text"
          placeholder="Buscar descrição..."
          value={search}
          onChange={handleSearchChange}
        />
        <Button onClick={openCreateModal}>Criar Novo Serviço</Button>
      </div>

      {/* Tabela de serviços */}
      <Table>
        <TableCaption>Lista de Serviços</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Observação</TableHead>
            <TableHead>Ações</TableHead> {/* Nova coluna */}
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
              <TableCell colSpan={5}>Erro ao carregar os serviços.</TableCell>
            </TableRow>
          )}

          {!isLoading && !error && data?.services?.length
            ? data.services.map((item) => (
                <TableRow key={item.id_service}>
                  <TableCell>{item.id_service}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.observation}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {/* Botão de Edição */}
                      <Button
                        variant="ghost"
                        onClick={() => openEditModal(item.id_service)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      {/* Botão de Exclusão */}
                      <Button
                        variant="ghost"
                        onClick={() => openDeleteModal(item.id_service)}
                        title="Excluir"
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
                  <TableCell colSpan={5}>Nenhum serviço encontrado.</TableCell>
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
            Página {data.page} de {data.lastPage}
          </span>
          <Button onClick={nextPage} disabled={page >= data.lastPage}>
            Próxima
          </Button>
        </div>
      )}

      {/*
        MODAL DE CRIAÇÃO
        (Aqui usando o seu componente <CreateServiceModal>)
      */}
      <CreateServiceModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onCreate={handleCreateService}
      />

      {/*
        MODAL DE EXCLUSÃO (confirmação simples)
      */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-4 rounded shadow-md max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir este serviço?</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={closeDeleteModal}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}

      {/*
        MODAL DE EDIÇÃO
        - Ao abrir, faz GET /services/:id e preenche os campos
        - Ao salvar, faz PUT /services/:id
      */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-4 rounded shadow-md max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Editar Serviço</h3>
            <form
              onSubmit={handleUpdateService}
              className="flex flex-col gap-2"
            >
              <div>
                <label className="font-semibold">Descrição:</label>
                <Input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-semibold">Tipo:</label>
                <Input
                  type="text"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-semibold">Preço:</label>
                <Input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-semibold">Observação:</label>
                <Input
                  type="text"
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  required
                />
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={closeEditModal}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
