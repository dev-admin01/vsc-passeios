// app/hooks/orders/useSingleOrder.ts
"use client";

import { api } from "@/services/api";
import { getCookieclient } from "@/lib/cookieClient";

// Função que faz a chamada ao endpoint para pegar uma ordem específica
export async function useSingleOrder(id: string) {
  const token = await getCookieclient();
  const response = await api.get(`/api/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("hook novo", response.data);
  return response.data; // { order: { ... }, status_code: 200 }
}

// Hook que obtém os detalhes de uma única ordem, usando SWR para cache
// export function useSingleOrder(id_order: string | null) {
//   // Se id_order for null, não faz requisição (SWR retorna null)
//   const { data, error, isLoading } = useSWR(
//     id_order ? `/api/orders/${id_order}` : null,
//     fetchOrder
//   );

//   return {
//     data, // { order: { ... }, status_code: 200 }
//     error,
//     isLoading,
//   };
// }
