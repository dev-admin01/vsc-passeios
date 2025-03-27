// app/hooks/orders/useGeneratePDF.ts
"use client";

import { api } from "@/services/api";
import { getCookieclient } from "@/lib/cookieClient";

export const useGeneratePDF = () => {
  // Busca a ordem completa (incluindo items) para gerar PDF
  const fetchOrderForPDF = async (id: string) => {
    const token = await getCookieclient();
    const response = await api.get(`/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Ex.: { order: {...}, status_code: 200 }
  };

  return { fetchOrderForPDF };
};
