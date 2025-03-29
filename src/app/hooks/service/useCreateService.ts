"use client";

import { useCallback } from "react";
import { api } from "@/services/api";
import { getCookieclient } from "@/lib/cookieClient";

// Estrutura de dados de criação de service
interface CreateServicePayload {
  description: string;
  type: string;
  price: string;
  observation: string;
}

export const useCreateService = () => {
  const createService = useCallback(
    async (serviceData: CreateServicePayload) => {
      const token = await getCookieclient();
      const response = await api.post("/api/services", serviceData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    []
  );

  return { createService };
};
