// app/orders/page/OrdersPage.tsx
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
import { Edit, Trash2, FileArchive } from "lucide-react";

import { useOrders } from "@/app/hooks/orders/useOrder";
import { useDeleteOrder } from "@/app/hooks/orders/useDeleteOrder";
import { useCreateOrder } from "@/app/hooks/orders/useCreateOrders";
import {
  useUpdateOrder,
  UpdateOrderPayload,
} from "@/app/hooks/orders/useUpdateOrder";

import { EditOrderModal } from "@/components/editOrderModal";
import { DeleteOrderModal } from "@/components/deleteOrderModal";
import { CreateOrderModal } from "@/components/createOrderModal";

import { useGeneratePDF } from "../hooks/orders/useGeneratePDF";

// Import da API do React-PDF
import { pdf } from "@react-pdf/renderer";
import OrderPDF from "@/components/pdf";

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [perpage] = useState(10);
  const [search, setSearch] = useState("");

  const { data, error, isLoading, mutate } = useOrders(page, perpage, search);
  const { deleteOrder } = useDeleteOrder();
  const { updateOrder } = useUpdateOrder();
  const { createOrder } = useCreateOrder();

  // Modals
  const [editOrderId, setEditOrderId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Hook para buscar dados da ordem
  const { fetchOrderForPDF } = useGeneratePDF();

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
    try {
      // 1) Buscar dados da ordem
      const response = await fetchOrderForPDF(id_order);
      if (!response?.order) {
        alert("Ordem não encontrada");
        return;
      }
      const orderData = response.order;

      // 2) Criar componente Document em memória
      const doc = <OrderPDF order={orderData} />;
      // 3) Converter doc em Blob
      const blob = await pdf(doc).toBlob();
      // 4) Gerar URL temporário e abrir em nova aba
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, "_blank");
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Falha ao gerar PDF");
    }
  }

  async function handleSendEmail() {
    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Caso precise enviar dados adicionais, adicione um body aqui:
        // body: JSON.stringify({ chave: "valor" }),
      });

      const data = await response.json();
      console.log("Resposta da API:", data);
      // Aqui você pode adicionar feedback para o usuário, por exemplo:
      // alert("Email enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar o email:", error);
      // Opcional: exibir mensagem de erro para o usuário
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
                  <TableCell>{order.price}</TableCell>
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
                        onClick={() => openDeleteModal(order.id_order)}
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {/* Botão para gerar e abrir PDF em nova guia */}
                      <Button
                        variant="ghost"
                        onClick={() => generatePDFInNewTab(order.id_order)}
                        title="PDF em Nova Aba"
                      >
                        <FileArchive className="h-4 w-4" />
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

      <div>
        <Button onClick={handleSendEmail}>EMAIL</Button>
      </div>

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
