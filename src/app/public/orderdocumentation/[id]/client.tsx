"use client";

import { useOrder } from "@/app/hooks/orders/useOrder";
import ClientOrderDocumentation from "@/components/documentsPage";
import DocumentsSent from "@/components/documentsPage/documentsSent";

interface OrderDocumentationClientProps {
  id_order: string;
}

export default function OrderDocumentationClient({
  id_order,
}: OrderDocumentationClientProps) {
  const { useOrders } = useOrder();

  const { data, error, isLoading } = useOrders(1, 1, id_order);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar a ordem.</div>;
  if (!data?.orders) return <div>Dados não encontrados.</div>;

  if (data && data.orders[0].status?.id_status_order === 5) {
    return (
      <ClientOrderDocumentation
        id={id_order}
        orderData={
          {
            order: {
              ...data.orders[0],
              id_status_order: data.orders[0].status?.id_status_order || 0,
            },
            status_code: 200,
          } as any
        }
        initialOrderNumber={data.orders[0].order_number}
      />
    );
  }

  return <DocumentsSent status={data.orders[0].status?.id_status_order || 0} />;
}
