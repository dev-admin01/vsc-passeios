"use client";

import useSWR from "swr";
import { api } from "@/services/api";
import { getCookieclient } from "@/lib/cookieClient";
import { OrdersResponse } from "@/types/orders.type";

const fetchOrders = async (page: number, perpage: number, search: string) => {
  const token = await getCookieclient();
  const response = await api.get<OrdersResponse>("/api/orders", {
    params: { page, perpage, search },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const useOrders = (page: number, perpage: number, search: string) => {
  const { data, error, isLoading, mutate } = useSWR<OrdersResponse>(
    ["get-orders", page, perpage, search],
    () => fetchOrders(page, perpage, search),
  );
  return { data, error, isLoading, mutate };
};
