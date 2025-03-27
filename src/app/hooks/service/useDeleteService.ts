"use client";

import { useCallback } from "react";
import { api } from "@/services/api";
import { getCookieclient } from "@/lib/cookieClient";

export const useDeleteService = () => {
  const deleteService = useCallback(async (id: number) => {
    const token = await getCookieclient();
    // Chama DELETE /services/:id
    const response = await api.delete(`/services/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }, []);

  return { deleteService };
};
