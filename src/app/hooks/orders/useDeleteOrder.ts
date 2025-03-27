"use client";
import { api } from "@/services/api";
import { getCookieclient } from "@/lib/cookieClient";

export const useDeleteOrder = () => {
  const deleteOrder = async (id: string) => {
    const token = await getCookieclient();
    console.log(id);
    const response = await api.delete(`/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  return { deleteOrder };
};
