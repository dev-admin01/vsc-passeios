"use client";

import { useCallback } from "react";
import useSWR from "swr";
import { api } from "@/services/api";
import { toast } from "sonner";

// Função para buscar services
const fetchServices = async () => {
  const response = await api.get("/api/services", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// Função para buscar services_suppliers
const fetchServicesSuppliers = async (
  page: number,
  perpage: number,
  supplier_id?: string,
  service_id?: string
) => {
  const params: any = { page, perpage };
  if (supplier_id) params.supplier_id = supplier_id;
  if (service_id) params.service_id = service_id;

  const response = await api.get("/api/services_suppliers", {
    params,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// Hook para services
export const useServices = () => {
  // Hook para listar todos os services
  const useServicesData = () => {
    const { data, error, isLoading, mutate } = useSWR(
      "get-services",
      fetchServices
    );

    return {
      data,
      isLoading,
      error,
      mutate,
    };
  };

  // Hook para listar services_suppliers
  const useServicesSuppliers = (
    page: number,
    perpage: number,
    supplier_id?: string,
    service_id?: string
  ) => {
    const { data, error, isLoading, mutate } = useSWR(
      ["get-services-suppliers", page, perpage, supplier_id, service_id],
      () => fetchServicesSuppliers(page, perpage, supplier_id, service_id)
    );

    return {
      data,
      isLoading,
      error,
      mutate,
    };
  };

  // Criar service_supplier
  const createServiceSupplier = useCallback(
    async (data: { id_supplier: string; id_service: number }) => {
      try {
        const response = await api.post("/api/services_suppliers", data, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status !== 201) {
          toast.error(response.data.message || "Erro ao associar serviço", {
            closeButton: true,
          });
          return false;
        }

        toast.success("Serviço associado com sucesso!", {
          closeButton: true,
        });

        return response.data;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Erro ao associar serviço";
        toast.error(errorMessage, { closeButton: true });
        return false;
      }
    },
    []
  );

  // Deletar service_supplier
  const deleteServiceSupplier = useCallback(async (id: number) => {
    try {
      const response = await api.delete(`/api/services_suppliers/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        toast.error(response.data.message, { closeButton: true });
        return false;
      }

      toast.success("Associação removida com sucesso!", {
        closeButton: true,
      });

      return true;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Erro ao remover associação",
        {
          closeButton: true,
        }
      );
      return false;
    }
  }, []);

  return {
    useServicesData,
    useServicesSuppliers,
    createServiceSupplier,
    deleteServiceSupplier,
  };
};
