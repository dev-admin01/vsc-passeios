"use client";

import { useCallback } from "react";
import { api } from "@/services/api";

export interface IServiceData {
  id_service: number;
  price?: number;
  suggested_date?: string;
  discount?: number;
  quantity?: number;
}

export interface CreateOrderPayload {
  id_user: string;
  pre_name: string;
  pre_email: string;
  pre_ddi: string;
  pre_ddd: string;
  pre_phone: string;
  price: string;
  id_cond_pag?: string;
  id_coupons?: string;
  services: {
    id_service: number;
    price: string;
    quantity: number;
    discount: number;
    suggested_date?: string;
    time?: string;
  }[];
}

export const useCreateOrder = () => {
  const createOrder = useCallback(async (orderData: CreateOrderPayload) => {
    console.log("hooke", orderData);
    console.log("hooke.services", orderData.services);
    orderData.price = orderData.price.toString().replace(".", ",");
    orderData.services.forEach((service) => {
      service.price = service.price.toString();
    });
    const response = await api.post("/api/orders", orderData);
    return response.data;
  }, []);

  return { createOrder };
};
