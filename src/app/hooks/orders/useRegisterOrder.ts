// app/hooks/orders/useSingleOrder.ts
"use client";

import useSWR from "swr";
import { api } from "@/services/api";
import { getCookieclient } from "@/lib/cookieClient";

async function fetchOrder(url: string) {
  const token = await getCookieclient();
  const response = await api.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
}

export function useRegisterOrder(id_order: string | null) {
  const { data, error, isLoading } = useSWR(
    id_order ? `/api/register/order/${id_order}` : null,
    fetchOrder,
  );

  return {
    data,
    error,
    isLoading,
  };
}
