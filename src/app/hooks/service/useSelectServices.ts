"use client";

import { useCallback } from "react";
import { api } from "@/services/api";
import { getCookieclient } from "@/lib/cookieClient";

export const useSelectServices = () => {
  const selectServices = useCallback(async () => {
    try {
      const token = await getCookieclient();
      const response = await api.get("/api/services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.services;
    } catch (error) {
      console.error("Erro ao buscar serviços", error);
      return [];
    }
  }, []);

  return { selectServices };
};
