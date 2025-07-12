"use client";
import { useAuthContext } from "@/app/contexts/authContext";
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
  Mails,
  Mail,
  Signature,
} from "lucide-react";

import { toast } from "sonner";

import { useOrder } from "@/app/hooks/orders/useOrder";

import { DeleteOrderModal } from "@/components/deleteOrderModal";
import { SendPdfOrderModal } from "@/components/sendPdfOrderModal";
import { ClientApprovedModal } from "@/components/clientAprprovedModal";
import { RegisterLinkModal } from "@/components/registerLinkModal";
import { VerifyDocsModal } from "@/components/verifyDocsModal";
import { SendContractModal } from "@/components/sendContractModal";
import { ConfirmSignatureModal } from "@/components/confirmSignatureModal";
import { redirect } from "next/navigation";
import { ConvertCurrency } from "@/lib/shared/currencyConverter";

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [perpage] = useState(10);
  const [search, setSearch] = useState("");

  const { user } = useAuthContext();

  const {
    useOrders,
    deleteOrder,
    updateStatus,
    approveOrderDocumentation,
    sendContract,
    invalidateOrderDocumentation,
  } = useOrder();
  if (user?.id_position === 4) {
    redirect("/dashboard");
  }

  const { data, error, isLoading, mutate } = useOrders(page, perpage, search);

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
    null,
  );
  const [orderToRegisterLinkNumber, setOrderToRegisterLinkNumber] = useState<
    string | null
  >(null);

  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [orderToDocument, setOrderToDocument] = useState<string | null>(null);
  const [orderToDocumentNumber, setOrderToDocumentNumber] = useState<
    string | null
  >(null);
  const [isInvalidatingDocs, setIsInvalidatingDocs] = useState(false);

  const [isSendContractModalOpen, setIsSendContractModalOpen] = useState(false);
  const [orderToSendContract, setOrderToSendContract] = useState<string | null>(
    null,
  );
  const [orderToSendContractNumber, setOrderToSendContractNumber] = useState<
    string | null
  >(null);
  const [isSendingContract, setIsSendingContract] = useState(false);

  const [isConfirmSignatureModalOpen, setIsConfirmSignatureModalOpen] =
    useState(false);
  const [orderToConfirmSignature, setOrderToConfirmSignature] = useState<
    string | null
  >(null);
  const [orderToConfirmSignatureNumber, setOrderToConfirmSignatureNumber] =
    useState<string | null>(null);
  const [isConfirmingSignature, setIsConfirmingSignature] = useState(false);

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

  function openSendContractModal(id_order: string, order_number: string) {
    setOrderToSendContract(id_order);
    setOrderToSendContractNumber(order_number);
    setIsSendContractModalOpen(true);
  }

  function openConfirmSignatureModal(id_order: string, order_number: string) {
    setOrderToConfirmSignature(id_order);
    setOrderToConfirmSignatureNumber(order_number);
    setIsConfirmSignatureModalOpen(true);
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
    window.open(`/pdf/order/${id}`, "_blank");
  }

  async function handleSendEmail() {
    setIsSending(true);

    const payload = {
      id_order: orderToSendPdf,
      order_number: orderToSendPdfNumber,
    };
    try {
      const response = await fetch(`/api/send-email/pdf-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 200) {
        toast.success(`Orçamento ${orderToSendPdfNumber} enviado com sucesso!`);
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
    const id_order = orderToClientApproved;
    const order_number = orderToClientApprovedNumber;

    if (id_order) {
      await updateStatus(id_order, status);
      mutate();
      setIsClientApprovedModalOpen(false);
      setOrderToClientApproved(null);
      setOrderToClientApprovedNumber(null);
    }

    if (status === 3) {
      toast.success(`Orçamento ${order_number} aprovado com sucesso!`);
    } else {
      toast.warning(`Orçamento ${order_number} rejeitado com sucesso!`);
    }
  }

  async function handleRegisterLink() {
    setIsSending(true);
    const id = orderToRegisterLink;
    const order_number = orderToRegisterLinkNumber;

    try {
      const response = await fetch(`/api/send-email/register-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_order: id }),
      });
      await response.json();

      if (response.status === 200) {
        toast.success(`Link de cadastro ${order_number} enviado com sucesso!`);
      } else {
        toast.error("Erro ao enviar o link de cadastro!");
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

  // Abre o modal para analisar documentos de um orçamento com status 6
  function openDocumentModal(id_order: string, order_number: string) {
    setOrderToDocument(id_order);
    setOrderToDocumentNumber(order_number);
    setIsDocumentModalOpen(true);
  }

  // Valida os documentos e altera o status do orçamento para "documentos validados" (status 7)
  async function handleVerifyDocs(id_cond_pag: string) {
    setIsSending(true);
    const id_order = orderToDocument;

    if (id_order !== null) {
      await approveOrderDocumentation(id_order, id_cond_pag);

      mutate();
      setIsDocumentModalOpen(false);
      setOrderToDocument(null);
      setOrderToDocumentNumber(null);
    }

    setIsSending(false);
  }

  async function handleInvalidateDocs() {
    setIsInvalidatingDocs(true);
    const id_order = orderToDocument;

    if (id_order !== null) {
      try {
        await invalidateOrderDocumentation(id_order);

        mutate();
        setIsDocumentModalOpen(false);
        setOrderToDocument(null);
        setOrderToDocumentNumber(null);
      } catch (error) {
        console.log(error);
        toast.error("Erro ao invalidar documentos!");
      } finally {
        setIsInvalidatingDocs(false);
      }
    }
  }

  async function handleSendContract(link: string) {
    setIsSendingContract(true);
    const id_order = orderToSendContract;

    if (id_order !== null) {
      const status = await sendContract(id_order, link);
      if (status === 200) {
        await sendEmailReceiptAndContract();
      }

      mutate();
      setIsSendContractModalOpen(false);
      setOrderToSendContract(null);
      setOrderToSendContractNumber(null);
      setIsSendingContract(false);
    }
  }

  async function sendEmailReceiptAndContract() {
    const payload = {
      id_order: orderToSendContract,
      order_number: orderToSendContractNumber,
    };

    const response = await fetch(`/api/send-email/receipt-and-contract`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 200) {
      toast.success(
        `Recibo e contrato do orçamento ${orderToSendContractNumber} enviado com sucesso!`,
      );
    } else {
      toast.error("Erro ao enviar o recibo e contrato!");
    }

    return response.status;
  }

  async function handleConfirmSignature() {
    setIsConfirmingSignature(true);
    const id_order = orderToConfirmSignature;
    const order_number = orderToConfirmSignatureNumber;

    if (id_order !== null) {
      try {
        await updateStatus(id_order, 10);

        toast.success(
          `Assinatura do orçamento ${order_number} confirmada com sucesso!`,
        );

        mutate();
        setIsConfirmSignatureModalOpen(false);
        setOrderToConfirmSignature(null);
        setOrderToConfirmSignatureNumber(null);
      } catch (error) {
        console.log(error);
        toast.error("Erro ao confirmar assinatura!");
      } finally {
        setIsConfirmingSignature(false);
      }
    }
  }
  console.log("data", data?.orders);

  return (
    <div className="p-4 min-h-screen bg-sky-100 sm:ml-17 sm:-mt-11">
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
              <TableCell colSpan={7}>Carregando orçamentos...</TableCell>
            </TableRow>
          )}
          {error && (
            <TableRow>
              <TableCell colSpan={7}>Erro ao carregar orçamentos.</TableCell>
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
                    {ConvertCurrency.formatCurrency(order.price)}
                  </TableCell>

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
                              order.order_number,
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
                      {order.status.id_status_order === 1 ||
                      order.status.id_status_order === 2 ? (
                        <Button
                          variant="ghost"
                          onClick={() =>
                            openSendPdfModal(order.id_order, order.order_number)
                          }
                          title={
                            order.status.id_status_order === 1
                              ? "Enviar orçamento"
                              : "Reenviar orçamento"
                          }
                          className="cursor-pointer"
                        >
                          {order.status.id_status_order === 1 ? (
                            <Send className="h-4 w-4" />
                          ) : (
                            <Mails className="h-4 w-4" />
                          )}
                        </Button>
                      ) : null}

                      {order.status.id_status_order === 3 && (
                        <Button
                          variant="ghost"
                          onClick={() =>
                            openRegisterLinkModal(
                              order.id_order,
                              order.order_number,
                            )
                          }
                          title={
                            order.status.id_status_order === 3
                              ? "Enviar cadastro"
                              : "Reenviar cadastro"
                          }
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
                              order.order_number,
                            )
                          }
                          title="Analisar documentos"
                          className="cursor-pointer"
                        >
                          <FileSearch2 className="h-4 w-4" />
                        </Button>
                      )}

                      {order.status.id_status_order === 8 && (
                        <Button
                          variant="ghost"
                          onClick={() =>
                            openSendContractModal(
                              order.id_order,
                              order.order_number,
                            )
                          }
                          title="Enviar contrato e recibo"
                          className="cursor-pointer"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}

                      {order.status.id_status_order === 9 && (
                        <Button
                          variant="ghost"
                          onClick={() =>
                            openConfirmSignatureModal(
                              order.id_order,
                              order.order_number,
                            )
                          }
                          title="Confirmar assinatura"
                          className="cursor-pointer"
                        >
                          <Signature className="h-4 w-4" />
                        </Button>
                      )}
                      {order.status.id_status_order !== 10 && (
                        <Button
                          variant="ghost"
                          onClick={() => openDeleteModal(order.id_order)}
                          title="Excluir"
                          className="cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            : !isLoading &&
              !error && (
                <TableRow>
                  <TableCell colSpan={7}>
                    Nenhum orçamento encontrado.
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
        onInvalidate={handleInvalidateDocs}
        idOrder={orderToDocument || ""}
        orderNumber={orderToDocumentNumber || ""}
        sendLoading={isSending}
        invalidateLoading={isInvalidatingDocs}
      />

      <SendContractModal
        isOpen={isSendContractModalOpen}
        onClose={() => setIsSendContractModalOpen(false)}
        onConfirm={handleSendContract}
        orderNumber={orderToSendContractNumber || ""}
        isLoading={isSendingContract}
      />

      <ConfirmSignatureModal
        isOpen={isConfirmSignatureModalOpen}
        onClose={() => setIsConfirmSignatureModalOpen(false)}
        onConfirm={handleConfirmSignature}
        orderNumber={orderToConfirmSignatureNumber || ""}
        isLoading={isConfirmingSignature}
      />
    </div>
  );
}
