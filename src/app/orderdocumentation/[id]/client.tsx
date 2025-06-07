"use client";

import { useRegisterOrder } from "@/app/hooks/orders/useRegisterOrder";
import ClientOrderDocumentation from "@/components/documentsPage";
import DocumentsSent from "@/components/documentsPage/documentsSent";
import { useEffect, useState } from "react";

interface OrderDocumentationClientProps {
  id: string;
}

export default function OrderDocumentationClient({
  id,
}: OrderDocumentationClientProps) {
  const { data, error, isLoading } = useRegisterOrder(id);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar a ordem.</div>;
  if (!data?.order) return <div>Dados não encontrados.</div>;

  if (data && data.order.id_status_order === 5) {
    return (
      <ClientOrderDocumentation
        id={id}
        orderData={data}
        initialOrderNumber={data.order.order_number}
      />
    );
  }

  return <DocumentsSent status={data.order.id_status_order} />;
}
