// "use client";

// import React, { useEffect, useState } from "react";
// import dynamic from "next/dynamic";

// // Import dinâmico para o PDFViewer do @react-pdf/renderer, sem SSR
// const PDFViewer = dynamic(
//   () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
//   { ssr: false }
// );

// // Import dinâmico para o OrderPDF, sem SSR
// const OrderPDF = dynamic(() => import("@/components/pdf"), {
//   ssr: false,
// });

// // Tipo dos dados fictícios
// interface MyOrderData {
//   id_user: string;
//   order_number: string;
//   pre_name: string;
//   pre_email: string;
//   pre_ddi: string;
//   pre_ddd: string;
//   pre_phone: string;
//   price: number;
//   orders_service: {
//     id_order_service: number;
//     id_service: number;
//     discount: number;
//     price: number;
//     suggested_date: string;
//     service: { description: string };
//   }[];
// }

// export default function PDFPage() {
//   const [orderData, setOrderData] = useState<MyOrderData | null>(null);

//   // Exemplo de "dados fictícios"
//   useEffect(() => {
//     setOrderData({
//       id_user: "1",
//       order_number: "12345",
//       pre_name: "joão da silva",
//       pre_email: "joao@example.com",
//       pre_ddi: "55",
//       pre_ddd: "11",
//       pre_phone: "999999999",
//       price: 150.0,
//       orders_service: [
//         {
//           id_order_service: 1,
//           id_service: 1,
//           discount: 0,
//           price: 150.0,
//           suggested_date: "2025-03-27T00:00:00.000Z",
//           service: {
//             description: "Passeio turístico",
//           },
//         },
//       ],
//     });
//   }, []);

//   // Se ainda estiver carregando dados...
//   if (!orderData) {
//     return <div>Carregando dados do orçamento...</div>;
//   }

//   return (
//     <div style={{ width: "100%", height: "100vh" }}>
//       {/* Aqui exibimos o PDF dentro do PDFViewer */}
//       <PDFViewer style={{ width: "100%", height: "100vh" }}>
//         <OrderPDF order={orderData} />
//       </PDFViewer>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/sidebar";

// Hooks existentes
import { useServices } from "@/app/hooks/service/useServices";
import { useCreateService } from "@/app/hooks/service/useCreateService";

// Novos hooks (edição / deleção / get único)
import { useDeleteService } from "@/app/hooks/service/useDeleteService";
import { useUpdateService } from "@/app/hooks/service/useUpdateService";
import { useGetService } from "@/app/hooks/service/useGetService";

// Ícones do lucide-react (instale via npm i lucide-react)
import { Edit, Trash2 } from "lucide-react";

import { CreateServicePayload } from "@/types/service.types";

// (Opcional) componente de criação que você já tem
import { CreateServiceModal } from "@/components/createServiceModal";
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
    <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
      <Sidebar />
      <h1 className="text-2xl font-bold">Passeios</h1>

      {/* Busca + Criar */}
      <div className="flex items-center gap-2 mb-4">
        <Input
          type="text"
          placeholder="Buscar descrição..."
          value={search}
          onChange={handleSearchChange}
          className="bg-amber-50"
        />
        <Button onClick={openCreateModal}>Novo Passeio</Button>
      </div>

      {/* Tabela de serviços */}
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
            ? data.services.map((item) => (
                <TableRow key={item.id_service}>
                  <TableCell>{item.id_service}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    {Number(item.price).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell>{item.observation}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => openEditModal(item.id_service)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
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
                  <TableCell colSpan={5}>Nenhum passeio encontrado.</TableCell>
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
            <p>Tem certeza que deseja excluir este Passeio?</p>
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
            <h3 className="text-lg font-bold mb-2">Editar Passeio</h3>
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
