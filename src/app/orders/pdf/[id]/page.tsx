"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Import dinâmico para o PDFViewer do @react-pdf/renderer, sem SSR
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

// Import dinâmico para o OrderPDF, sem SSR
const OrderPDF = dynamic(() => import("@/components/pdf"), {
  ssr: false,
});

// Tipo dos dados fictícios
interface MyOrderData {
  id_user: string;
  order_number: string;
  pre_name: string;
  pre_email: string;
  pre_ddi: string;
  pre_ddd: string;
  pre_phone: string;
  price: number;
  orders_service: {
    id_order_service: number;
    id_service: number;
    discount: number;
    price: number;
    suggested_date: string;
    service: { description: string };
  }[];
}

export default function PDFPage() {
  const [orderData, setOrderData] = useState<MyOrderData | null>(null);

  // Exemplo de "dados fictícios"
  useEffect(() => {
    setOrderData({
      id_user: "1",
      order_number: "12345",
      pre_name: "joão da silva",
      pre_email: "joao@example.com",
      pre_ddi: "55",
      pre_ddd: "11",
      pre_phone: "999999999",
      price: 150.0,
      orders_service: [
        {
          id_order_service: 1,
          id_service: 1,
          discount: 0,
          price: 150.0,
          suggested_date: "2025-03-27T00:00:00.000Z",
          service: {
            description: "Passeio turístico",
          },
        },
      ],
    });
  }, []);

  // Se ainda estiver carregando dados...
  if (!orderData) {
    return <div>Carregando dados do orçamento...</div>;
  }

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {/* Aqui exibimos o PDF dentro do PDFViewer */}
      <PDFViewer style={{ width: "100%", height: "100vh" }}>
        <OrderPDF order={orderData} />
      </PDFViewer>
    </div>
  );
}
