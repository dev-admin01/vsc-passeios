"use client";

import { useCallback } from "react";
import { api } from "@/services/api";
import { getCookieclient } from "@/lib/cookieClient";

export interface IServiceData {
  id_service: number;
  price?: number;
  suggested_date?: string;
  discount?: number;
}

export interface CreateOrderPayload {
  id_user: string;
  price: number;
  pre_name: string;
  pre_email: string;
  pre_ddi: string;
  pre_ddd: string;
  pre_phone: string;
  id_costumer?: string;
  id_status_order?: number;
  services?: IServiceData[];
}

export const useCreateOrder = () => {
  const createOrder = useCallback(async (orderData: CreateOrderPayload) => {
    console.log("hooke", orderData);
    const token = await getCookieclient();
    const response = await api.post("/api/orders", orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }, []);

  return { createOrder };
};
