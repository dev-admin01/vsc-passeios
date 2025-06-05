"use client";

import useSWR from "swr";
import { api } from "@/services/api";
import { getCookieclient } from "@/lib/cookieClient";

export interface GetOrderDocsResponse {
  message: string;
  docsValidation: any[];
  status_code: number;
}

const fetchOrderDocs = async (orderId: string) => {
  const token = await getCookieclient();
  const response = await api.get(`/api/orderdocs/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const useDocumentation = (orderId: string) => {
  const { data, error, isLoading, mutate } = useSWR<GetOrderDocsResponse>(
    ["get-order-docs", orderId],
    () => fetchOrderDocs(orderId)
  );
  return { data, error, isLoading, mutate };
};
