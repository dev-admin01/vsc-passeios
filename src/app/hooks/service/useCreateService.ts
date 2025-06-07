"use client";

import { useCallback } from "react";
import { api } from "@/services/api";
import { getCookieclient } from "@/lib/cookieClient";
import { ServiceFormData } from "@/app/services/new/service-form";

export const useCreateService = () => {
  const createService = useCallback(async (serviceData: ServiceFormData) => {
    const token = await getCookieclient();
    const response = await api.post("/api/services", serviceData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  }, []);

  return { createService };
};
