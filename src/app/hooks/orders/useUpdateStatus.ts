"use client";
import { api } from "@/services/api";

export interface UpdateOrderPayload {
  id_order: string;
  id_status_order: number;
}

export const useUpdateStatus = () => {
  const updateStatus = async (payload: UpdateOrderPayload) => {
    // const statusData = {
    //   id_order: payload.id_order,
    //   id_user: "1",
    //   id_status_order: payload.id_status_order,
    // };
    const response = await api.put(`/api/statusupdate`);
    return response.data;
  };

  return { updateStatus };
};
