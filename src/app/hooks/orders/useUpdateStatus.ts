"use client";
import { api } from "@/services/api";

export interface UpdateOrderPayload {
  id_order: string;
  id_status_order: number;
}

export const useUpdateStatus = () => {
  const updateStatus = async (payload: UpdateOrderPayload) => {
    console.log("payload", payload);
    const response = await api.put(`/api/statusupdate`, payload);
    return response.data;
  };

  return { updateStatus };
};
