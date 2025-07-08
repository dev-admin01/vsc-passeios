"use client";

import { useCallback } from "react";
import useSWR from "swr";
import { api } from "@/services/api";
import { toast } from "sonner";

import {
  SuppliersResponse,
  Supplier,
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from "@/types/supplier.types";

// Função para buscar suppliers com paginação
const fetchSuppliers = async (
  page: number,
  perpage: number,
  search: string
) => {
  const response = await api.get<SuppliersResponse>("/api/suppliers", {
    params: {
      page,
      perpage,
      search,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// Hook para suppliers
export const useSuppliers = () => {
  // Hook para listar suppliers com paginação
  const useSuppliersData = (page: number, perpage: number, search: string) => {
    const { data, error, isLoading, mutate } = useSWR<SuppliersResponse>(
      ["get-suppliers", page, perpage, search],
      () => fetchSuppliers(page, perpage, search)
    );

    return {
      data,
      isLoading,
      error,
      mutate,
    };
  };

  // Criar supplier
  const createSupplier = useCallback(
    async (supplierData: CreateSupplierRequest) => {
      try {
        const response = await api.post("/api/suppliers", supplierData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status !== 201) {
          toast.error(response.data.message || "Erro ao criar fornecedor", {
            closeButton: true,
          });
          return false;
        }

        toast.success(
          `Fornecedor ${response.data.nome_fantasia} criado com sucesso!`,
          {
            closeButton: true,
          }
        );

        return response;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Erro ao criar fornecedor";
        toast.error(errorMessage, { closeButton: true });
        return false;
      }
    },
    []
  );

  // Atualizar supplier
  const updateSupplier = useCallback(
    async (id: string, data: UpdateSupplierRequest) => {
      try {
        const response = await api.patch(`/api/suppliers/${id}`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status !== 200) {
          toast.error(response.data.message || "Erro ao atualizar fornecedor", {
            closeButton: true,
          });
          return false;
        }

        toast.success(
          `Fornecedor ${response.data.nome_fantasia} atualizado com sucesso!`,
          {
            closeButton: true,
          }
        );

        return response.data;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Erro ao atualizar fornecedor";
        toast.error(errorMessage, { closeButton: true });
        return false;
      }
    },
    []
  );

  // Deletar supplier
  const deleteSupplier = useCallback(async (id: string) => {
    try {
      const response = await api.delete(`/api/suppliers/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        toast.error(response.data.message, { closeButton: true });
        return false;
      }

      toast.success(`Fornecedor deletado com sucesso!`, {
        closeButton: true,
      });

      return true;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Erro ao deletar fornecedor",
        {
          closeButton: true,
        }
      );
      return false;
    }
  }, []);

  // Buscar supplier por ID
  const getSupplier = useCallback(async (id: string) => {
    try {
      const response = await api.get(`/api/suppliers/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        toast.error(response.data.message, { closeButton: true });
        return null;
      }

      return response.data;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Erro ao buscar fornecedor",
        {
          closeButton: true,
        }
      );
      return null;
    }
  }, []);

  return {
    useSuppliersData,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplier,
  };
};
