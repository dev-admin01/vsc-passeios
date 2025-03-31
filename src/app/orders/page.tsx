"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, FileArchive, Send, FileSearch2 } from "lucide-react";

import { useOrders } from "@/app/hooks/orders/useOrder";
import { useDeleteOrder } from "@/app/hooks/orders/useDeleteOrder";
import { useCreateOrder } from "@/app/hooks/orders/useCreateOrders";
import {
  useUpdateOrder,
  UpdateOrderPayload,
} from "@/app/hooks/orders/useUpdateOrder";
import { useUpdateStatus } from "../hooks/orders/useUpdateStatus";

import { EditOrderModal } from "@/components/editOrderModal";
import { DeleteOrderModal } from "@/components/deleteOrderModal";
import { CreateOrderModal } from "@/components/createOrderModal";

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [perpage] = useState(10);
  const [search, setSearch] = useState("");

  const { data, error, isLoading, mutate } = useOrders(page, perpage, search);
  const { deleteOrder } = useDeleteOrder();
  const { updateOrder } = useUpdateOrder();
  const { createOrder } = useCreateOrder();
  const { updateStatus } = useUpdateStatus();

  // Modals
  const [editOrderId, setEditOrderId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  function openEditModal(id_order: string) {
    setEditOrderId(id_order);
    setIsEditModalOpen(true);
  }

  function openDeleteModal(id: string) {
    setOrderToDelete(id);
    setIsDeleteModalOpen(true);
  }

  function openCreateModal() {
    setIsCreateModalOpen(true);
  }

  async function handleUpdate(payload: UpdateOrderPayload) {
    if (editOrderId) {
      await updateOrder(editOrderId, payload);
      mutate();
      setIsEditModalOpen(false);
      setEditOrderId(null);
    }
  }

  async function handleDelete() {
    if (orderToDelete) {
      await deleteOrder(orderToDelete);
      mutate();
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
    }
  }

  async function handleCreate(orderData: any) {
    await createOrder(orderData);
    mutate();
  }

  function previousPage() {
    if (page > 1) setPage(page - 1);
  }

  function nextPage() {
    if (data && page < data.lastPage) setPage(page + 1);
  }

  // FUNÇÃO: buscar dados e abrir PDF em nova aba
  async function generatePDFInNewTab(id_order: string) {
    const id = id_order;
    console.log(id);
    window.open(`/pdf/${id}`, "_blank");
  }

  async function handleSendEmail(id: string) {
    const idData = {
      id_order: id,
    };
    try {
      const response = await fetch(`/api/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(idData),
      });
      await response.json();

      const statusData = {
        id_order: id,
        id_status_order: 2,
      };

      updateStatus(statusData);
    } catch (error) {
      console.error("Erro ao enviar o email:", error);
    }
  }

  return (
    <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
      <Sidebar />
      <h1 className="text-2xl font-bold mb-4">Orçamentos</h1>

      {/* Busca + Botão Criar */}
      <div className="flex items-center gap-2 mb-4">
        <Input
          type="text"
          placeholder="Buscar orçamentos..."
          value={search}
          onChange={handleSearchChange}
          className="bg-amber-50"
        />
        <Button onClick={openCreateModal}>Novo orçamento</Button>
      </div>

      {/* Tabela */}
      <Table>
        {/* <TableCaption>Orçamentos</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableCell>Número</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Vendedor</TableCell>
            <TableCell>Valor total (R$)</TableCell>
            <TableCell>Aberto em:</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={7}>Carregando...</TableCell>
            </TableRow>
          )}
          {error && (
            <TableRow>
              <TableCell colSpan={7}>Erro ao carregar orders.</TableCell>
            </TableRow>
          )}
          {!isLoading && data?.orders?.length
            ? data.orders.map((order: any) => (
                <TableRow key={order.id_order}>
                  <TableCell>{order.order_number}</TableCell>
                  <TableCell>
                    {order.costumer ? order.costumer.nome : order.pre_name}
                  </TableCell>
                  <TableCell>{order.user?.name || "N/A"}</TableCell>
                  <TableCell>
                    {Number(order.price).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>

                  <TableCell>
                    {new Date(order.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>{order.status?.description || "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => openEditModal(order.id_order)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        onClick={() => generatePDFInNewTab(order.id_order)}
                        title="Exibir PDF"
                      >
                        <FileArchive className="h-4 w-4" />
                      </Button>
                      {order.status.id_status_order === 1 && (
                        <Button
                          variant="ghost"
                          onClick={() => handleSendEmail(order.id_order)}
                          title="Enviar orçamento"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      {order.status.id_status_order === 3 && (
                        <Button
                          variant="ghost"
                          onClick={() => alert("Vizualiar docs!")}
                          title="Analisar documentos"
                        >
                          <FileSearch2 className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        onClick={() => openDeleteModal(order.id_order)}
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
                  <TableCell colSpan={7}>Nenhum order encontrado.</TableCell>
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

      {/* Modals */}
      <EditOrderModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        orderId={editOrderId}
        onSave={handleUpdate}
      />
      <DeleteOrderModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
