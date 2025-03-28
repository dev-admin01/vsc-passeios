// app/hooks/orders/useSingleOrder.ts
"use client";

import useSWR from "swr";
import { api } from "@/services/api";
import { getCookieclient } from "@/lib/cookieClient";

// Função que faz a chamada ao endpoint para pegar uma ordem específica
async function fetchOrder(url: string) {
  const token = await getCookieclient();
  const response = await api.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // { order: { ... }, status_code: 200 }
}

// Hook que obtém os detalhes de uma única ordem, usando SWR para cache
export function useSingleOrder(id_order: string | null) {
  // Se id_order for null, não faz requisição (SWR retorna null)
  const { data, error, isLoading } = useSWR(
    id_order ? `/api/orders/${id_order}` : null,
    fetchOrder
  );

  return {
    data, // { order: { ... }, status_code: 200 }
    error,
    isLoading,
  };
}
