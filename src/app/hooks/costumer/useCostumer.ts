"use client";

import { useCallback } from "react";
import useSWR from "swr";
import { api } from "@/services/api";
import { toast } from "sonner";

import { CustomersResponse } from "@/types/customer.types";

// Função para buscar customers com paginação
const fetchCustomers = async (
  page: number,
  perpage: number,
  search: string,
) => {
  const response = await api.get<CustomersResponse>("/api/customers", {
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

// Hook para customers
export const useCustomer = () => {
  // Hook para listar customers com paginação
  const useCustomers = (page: number, perpage: number, search: string) => {
    const { data, error, isLoading, mutate } = useSWR<CustomersResponse>(
      ["get-customers", page, perpage, search],
      () => fetchCustomers(page, perpage, search),
    );

    return {
      data,
      isLoading,
      error,
      mutate,
    };
  };

  // Criar customer
  const createCustomer = useCallback(async (customerData: any) => {
    try {
      const response = await api.post("/api/customers", customerData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 201) {
        toast.error(response.data.message || "Erro ao criar cliente", {
          closeButton: true,
        });
        return false;
      }

      toast.success(`Cliente ${response.data.nome} criado com sucesso!`, {
        closeButton: true,
      });

      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erro ao criar cliente";
      toast.error(errorMessage, { closeButton: true });
      return false;
    }
  }, []);

  // Atualizar customer
  const updateCustomer = useCallback(async (id: string, data: any) => {
    try {
      const response = await api.patch(`/api/customers/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        toast.error(response.data.message || "Erro ao atualizar cliente", {
          closeButton: true,
        });
        return false;
      }

      toast.success(`Cliente ${response.data.nome} atualizado com sucesso!`, {
        closeButton: true,
      });

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erro ao atualizar cliente";
      toast.error(errorMessage, { closeButton: true });
      return false;
    }
  }, []);

  // Deletar customer
  const deleteCustomer = useCallback(async (id: string) => {
    try {
      const response = await api.delete(`/api/customers/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        toast.error(response.data.message, { closeButton: true });
        return false;
      }

      toast.success(`Cliente deletado com sucesso!`, {
        closeButton: true,
      });

      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao deletar cliente", {
        closeButton: true,
      });
      return false;
    }
  }, []);

  // Buscar customer por ID
  const getCustomer = useCallback(async (id: string) => {
    try {
      const response = await api.get(`/api/customers/${id}`, {
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
      toast.error(error.response?.data?.message || "Erro ao buscar cliente", {
        closeButton: true,
      });
      return null;
    }
  }, []);

  return {
    useCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomer,
  };
};
