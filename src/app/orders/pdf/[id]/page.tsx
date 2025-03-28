// app/orders/pdf/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import OrderPDF from "@/components/pdf";

// Dados fictícios só pra demonstrar.
// Substitua por sua chamada de API ou dados reais vindos de outro lugar.
const dummyOrderData = {
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
};

export default function PDFPage() {
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    // Aqui você pode fazer um fetch real, ex:
    // fetch('/api/orders/12345')
    //   .then(res => res.json())
    //   .then(data => setOrderData(data))

    // Para exemplo, usamos a dummy data acima
    setOrderData(dummyOrderData);
  }, []);

  if (!orderData) {
    return <div>Carregando dados do orçamento...</div>;
  }

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <PDFViewer style={{ width: "100%", height: "100%" }}>
        <OrderPDF order={orderData} />
      </PDFViewer>
    </div>
  );
}
