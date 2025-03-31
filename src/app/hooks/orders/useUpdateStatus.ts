"use client";
import { api } from "@/services/api";
import { getCookieclient, getUserClient } from "@/lib/cookieClient";

export interface UpdateOrderPayload {
  id_order: string;
  id_status_order: number;
}

export const useUpdateStatus = () => {
  const updateStatus = async (payload: UpdateOrderPayload) => {
    const token = await getCookieclient();
    const id_user = await getUserClient();

    const statusData = {
      id_order: payload.id_order,
      id_user,
      id_status_order: payload.id_status_order,
    };
    const response = await api.put(`/api/statusupdate`, statusData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  return { updateStatus };
};
