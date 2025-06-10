// app/hooks/orders/useSingleOrder.ts
"use client";

import { api } from "@/services/api";
import { getCookieclient } from "@/lib/cookieClient";

export async function useSingleOrder(id: string) {
  const token = await getCookieclient();
  const response = await api.get(`/api/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
