"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
import {
  Edit,
  Trash2,
  FileArchive,
  Send,
  FileSearch2,
  FileCheck2,
  BookUp2,
} from "lucide-react";

import { toast } from "sonner";

import { useOrders } from "@/app/hooks/orders/useOrder";
import { useDeleteOrder } from "@/app/hooks/orders/useDeleteOrder";

import { useUpdateStatus } from "../hooks/orders/useUpdateStatus";

import { DeleteOrderModal } from "@/components/deleteOrderModal";
import { SendPdfOrderModal } from "@/components/sendPdfOrderModal";
import { ClientApprovedModal } from "@/components/clientAprprovedModal";
import { RegisterLinkModal } from "@/components/registerLinkModal";
import { VerifyDocsModal } from "@/components/verifyDocsModal";

function formatCurrency(value: string | number) {
  if (!value) return "0,00";

  const numericValue =
    typeof value === "string"
      ? parseFloat(value.replace(/[^\d,-]/g, "").replace(",", "."))
      : value;
  return numericValue.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [perpage] = useState(10);
  const [search, setSearch] = useState("");

  const { data, error, isLoading, mutate } = useOrders(page, perpage, search);
  const { deleteOrder } = useDeleteOrder();
  const { updateStatus } = useUpdateStatus();

  // Modals

  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isSendPdfModalOpen, setIsSendPdfModalOpen] = useState(false);
  const [orderToSendPdf, setOrderToSendPdf] = useState<string | null>(null);
  const [orderToSendPdfNumber, setOrderToSendPdfNumber] = useState<
    string | null
  >(null);
  const [isSending, setIsSending] = useState(false);

  const [isClientApprovedModalOpen, setIsClientApprovedModalOpen] =
    useState(false);
  const [orderToClientApproved, setOrderToClientApproved] = useState<
    string | null
  >(null);
  const [orderToClientApprovedNumber, setOrderToClientApprovedNumber] =
    useState<string | null>(null);

  const [isRegisterLinkModalOpen, setIsRegisterLinkModalOpen] = useState(false);
  const [orderToRegisterLink, setOrderToRegisterLink] = useState<string | null>(
    null
  );
  const [orderToRegisterLinkNumber, setOrderToRegisterLinkNumber] = useState<
    string | null
  >(null);

  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [orderToDocument, setOrderToDocument] = useState<string | null>(null);
  const [orderToDocumentNumber, setOrderToDocumentNumber] = useState<
    string | null
  >(null);

  useEffect(() => {
    const successMessage = localStorage.getItem("orderSuccessMessage");
    if (successMessage) {
      toast.success(successMessage);
      localStorage.removeItem("orderSuccessMessage");
    }
  }, []);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  function openDeleteModal(id: string) {
    setOrderToDelete(id);
    setIsDeleteModalOpen(true);
  }

  function openSendPdfModal(id_order: string, order_number: string) {
    setOrderToSendPdf(id_order);
    setOrderToSendPdfNumber(order_number);
    setIsSendPdfModalOpen(true);
  }

  function openClientApprovedModal(id_order: string, order_number: string) {
    setOrderToClientApproved(id_order);
    setOrderToClientApprovedNumber(order_number);
    setIsClientApprovedModalOpen(true);
  }

  function openRegisterLinkModal(id_order: string, order_number: string) {
    setOrderToRegisterLink(id_order);
    setOrderToRegisterLinkNumber(order_number);
    setIsRegisterLinkModalOpen(true);
  }

  async function handleDelete() {
    if (orderToDelete) {
      setIsDeleting(true);
      try {
        await deleteOrder(orderToDelete);
        mutate();
        setIsDeleteModalOpen(false);
        setOrderToDelete(null);
      } finally {
        setIsDeleting(false);
      }
    }
  }

  function previousPage() {
    if (page > 1) setPage(page - 1);
  }

  function nextPage() {
    if (data && page < data.lastPage) setPage(page + 1);
  }

  async function generatePDFInNewTab(id_order: string) {
    const id = id_order;
    window.open(`/pdf/${id}`, "_blank");
  }

  async function handleSendEmail() {
    setIsSending(true);
    const id = orderToSendPdf;
    const order_number = orderToSendPdfNumber;
    const idData = {
      id_order: id,
      order_number: order_number,
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

      if (id !== null) {
        await updateStatus({
          id_order: id,
          id_status_order: 2,
        });

        toast.success(`Orçamento ${order_number} enviado com sucesso!`);
      } else {
        toast.error("ID do pedido inválido para atualizar o status.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro ao enviar o email!");
    } finally {
      mutate();
      setIsSendPdfModalOpen(false);
      setOrderToSendPdf(null);
      setOrderToSendPdfNumber(null);
      setIsSending(false);
    }
  }

  async function handleRejected() {
    handleClientApproved(4);
  }

  async function handleApproved() {
    handleClientApproved(3);
  }

  async function handleClientApproved(status: number) {
    const id = orderToClientApproved;
    const order_number = orderToClientApprovedNumber;

    if (id !== null) {
      await updateStatus({
        id_order: id,
        id_status_order: status,
      });

      mutate();
      if (status === 3) {
        toast.success(`Orçamento ${order_number} aprovado com sucesso!`);
      } else {
        toast.warning(`Orçamento ${order_number} rejeitado com sucesso!`);
      }
      setIsClientApprovedModalOpen(false);
      setOrderToClientApproved(null);
      setOrderToClientApprovedNumber(null);
    }
  }

  async function handleRegisterLink() {
    setIsSending(true);
    const id = orderToRegisterLink;
    const order_number = orderToRegisterLinkNumber;

    try {
      const response = await fetch(`/api/send/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_order: id }),
      });
      await response.json();

      if (id !== null) {
        await updateStatus({
          id_order: id,
          id_status_order: 5,
        });

        toast.success(`Link de cadastro ${order_number} enviado com sucesso!`);
      } else {
        toast.error("ID do pedido inválido para atualizar o status.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro ao enviar o link de cadastro!");
    } finally {
      mutate();
      setIsSendPdfModalOpen(false);
      setOrderToRegisterLink(null);
      setOrderToRegisterLinkNumber(null);
      setIsSending(false);
    }

    setIsRegisterLinkModalOpen(false);
    setOrderToRegisterLink(null);
    setOrderToRegisterLinkNumber(null);
    setIsSending(false);
    mutate();
  }

  function openDocumentModal(id_order: string, order_number: string) {
    setOrderToDocument(id_order);
    setOrderToDocumentNumber(order_number);
    setIsDocumentModalOpen(true);
  }

  async function handleVerifyDocs() {
    setIsSending(true);

    const id = orderToDocument;
    if (id !== null) {
      try {
        await updateStatus({
          id_order: id,
          id_status_order: 8,
        });

        mutate();
        toast.success(
          `Documentos do orçamento ${orderToDocumentNumber} validados com sucesso!`
        );
        setIsDocumentModalOpen(false);
        setOrderToDocument(null);
        setOrderToDocumentNumber(null);
      } catch (error) {
        console.log(error);
        toast.error("Erro ao verificar documentos!");
      } finally {
        setIsSending(false);
      }
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
        <Link href="/orders/new">
          <Button className="cursor-pointer">Novo orçamento</Button>
        </Link>
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
                  <TableCell>{formatCurrency(order.price)}</TableCell>

                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>{order.status?.description || "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {[1, 4].includes(order.status.id_status_order) && (
                        <Link href={`/orders/update/${order.id_order}`}>
                          <Button
                            variant="ghost"
                            title="Editar"
                            className="cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}

                      {order.status.id_status_order === 2 && (
                        <Button
                          variant="ghost"
                          onClick={() =>
                            openClientApprovedModal(
                              order.id_order,
                              order.order_number
                            )
                          }
                          title="Aprovar orçamento"
                          className="cursor-pointer"
                        >
                          <FileCheck2 className="h-4 w-4 text-green-500" />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        onClick={() => generatePDFInNewTab(order.id_order)}
                        title="Exibir PDF"
                        className="cursor-pointer"
                      >
                        <FileArchive className="h-4 w-4" />
                      </Button>
                      {order.status.id_status_order === 1 && (
                        <Button
                          variant="ghost"
                          onClick={() =>
                            openSendPdfModal(order.id_order, order.order_number)
                          }
                          title="Enviar orçamento"
                          className="cursor-pointer"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}

                      {order.status.id_status_order === 3 && (
                        <Button
                          variant="ghost"
                          onClick={() =>
                            openRegisterLinkModal(
                              order.id_order,
                              order.order_number
                            )
                          }
                          title="Enviar cadastro"
                          className="cursor-pointer"
                        >
                          <BookUp2 className="h-4 w-4" />
                        </Button>
                      )}

                      {order.status.id_status_order === 6 && (
                        <Button
                          variant="ghost"
                          onClick={() =>
                            openDocumentModal(
                              order.id_order,
                              order.order_number
                            )
                          }
                          title="Analisar documentos"
                          className="cursor-pointer"
                        >
                          <FileSearch2 className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        onClick={() => openDeleteModal(order.id_order)}
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
      <DeleteOrderModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />

      <SendPdfOrderModal
        isOpen={isSendPdfModalOpen}
        onClose={() => setIsSendPdfModalOpen(false)}
        onConfirm={handleSendEmail}
        orderNumber={orderToSendPdfNumber || ""}
        isLoading={isSending}
      />

      <ClientApprovedModal
        isOpen={isClientApprovedModalOpen}
        onClose={() => setIsClientApprovedModalOpen(false)}
        onApproved={handleApproved}
        onRejected={handleRejected}
        orderNumber={orderToClientApprovedNumber || ""}
        isLoading={isSending}
      />

      <RegisterLinkModal
        isOpen={isRegisterLinkModalOpen}
        onClose={() => setIsRegisterLinkModalOpen(false)}
        onConfirm={handleRegisterLink}
        orderNumber={orderToRegisterLinkNumber || ""}
        isLoading={isSending}
      />

      <VerifyDocsModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        onConfirm={handleVerifyDocs}
        idOrder={orderToDocument || ""}
        orderNumber={orderToDocumentNumber || ""}
        sendLoading={isSending}
      />
    </div>
  );
}
