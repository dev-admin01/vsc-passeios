"use client";
import { api } from "@/services/api";

export interface UpdateOrderPayload {
  id_order?: string;
  id_user: string;
  order_number?: string;
  id_costumer?: string | null | undefined;
  pre_name?: string;
  pre_email?: string;
  pre_ddi?: string;
  pre_ddd?: string;
  pre_phone?: string;
  price?: number;
  services?: {
    id_order_service?: number; // Se existir, indica update; se não, cria novo registro
    id_service: number;
    price: number;
    discount?: number;
    suggestedDate?: string;
  }[];
  // Adicione outros campos se necessário
}

export const useUpdateOrder = () => {
  const updateOrder = async (id: string, payload: UpdateOrderPayload) => {
    const response = await api.put(`/api/orders/${id}`, payload);
    return response.data;
  };

  return { updateOrder };
};
