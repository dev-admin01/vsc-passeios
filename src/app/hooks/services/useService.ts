"use client";

import { useCallback } from "react";
import useSWR from "swr";
import { api } from "@/services/api";
import { ServicesResponse } from "@/types/service.types";
import { toast } from "sonner";

// Função para buscar services com paginação
const fetchServices = async (page: number, perpage: number, search: string) => {
  const response = await api.get<ServicesResponse>("/api/services", {
    params: {
      page,
      perpage,
      search,
    },
  });

  return response.data;
};

// Hook principal unificado
export const useService = () => {
  // Hook para listar services com paginação
  const useServices = (page: number, perpage: number, search: string) => {
    const { data, error, isLoading, mutate } = useSWR<ServicesResponse>(
      ["get-services", page, perpage, search],
      () => fetchServices(page, perpage, search),
    );

    return {
      data,
      isLoading,
      error,
      mutate,
    };
  };

  // Criar service
  const createService = useCallback(async (serviceData: any) => {
    const response = await api.post("/api/services", serviceData);

    if (response.status !== 201) {
      toast.error(response.data.message, { closeButton: true });
    }

    toast.success(`Passeio ${response.data.description} criado com sucesso!`, {
      closeButton: true,
    });

    return response;
  }, []);

  // Atualizar service
  const updateService = useCallback(async (id: number, data: any) => {
    const response = await api.patch(`/api/services/${id}`, data);

    console.log("response.data update", response.data);

    if (response.status !== 200) {
      toast.error(response.data.message, { closeButton: true });
    }

    toast.success(
      `Passeio ${response.data.description} atualizado com sucesso!`,
      {
        closeButton: true,
      },
    );

    return response.data;
  }, []);

  // Deletar service
  const deleteService = useCallback(async (id: number) => {
    const response = await api.delete(`/api/services/${id}`);

    if (response.status !== 200) {
      toast.error(response.data.message, { closeButton: true });
      return false;
    }

    toast.success(`Passeio deletado com sucesso!`, {
      closeButton: true,
    });

    return true;
  }, []);

  // Buscar service por ID
  const getService = useCallback(async (id: number) => {
    const response = await api.get(`/api/services/${id}`);

    if (response.status !== 200) {
      toast.error(response.data.message, { closeButton: true });
    }

    return response.data;
  }, []);

  // Selecionar todos os services (para dropdowns)
  const selectServices = useCallback(async () => {
    const response = await api.get("/api/services");

    if (response.status !== 200) {
      toast.error(response.data.message, { closeButton: true });
    }

    return response.data.services;
  }, []);

  return {
    useServices,
    createService,
    updateService,
    deleteService,
    getService,
    selectServices,
  };
};
