"use client";

import { useCallback } from "react";
import { api } from "@/services/api";
import { getCookieclient } from "@/lib/cookieClient";

export const useGetService = () => {
  const getService = useCallback(async (id: number) => {
    const token = await getCookieclient();
    // Chama GET /services/:id
    const response = await api.get(`/api/services/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.service;
  }, []);

  return { getService };
};
