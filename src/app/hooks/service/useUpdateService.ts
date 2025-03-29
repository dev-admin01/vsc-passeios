"use client";

import { useCallback } from "react";
import { api } from "@/services/api";
import { getCookieclient } from "@/lib/cookieClient";

interface UpdateServicePayload {
  description: string;
  type: string;
  price: string;
  observation: string;
}

export const useUpdateService = () => {
  const updateService = useCallback(
    async (id: number, data: UpdateServicePayload) => {
      const token = await getCookieclient();
      // Chama PUT /services/:id
      const response = await api.put(`/api/services/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    []
  );

  return { updateService };
};
