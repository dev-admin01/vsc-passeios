"use client";

import { useCallback } from "react";
import useSWR from "swr";
import { api } from "@/services/api";
import { OrdersResponse } from "@/types/orders.type";
import { toast } from "sonner";
import { OrderInputValues, OrderUpdateValues } from "@/models/order";
import { useRouter } from "next/navigation";

// Função para buscar orders com paginação
const fetchOrders = async (page: number, perpage: number, search: string) => {
  const response = await api.get<OrdersResponse>("/api/orders", {
    params: {
      page,
      perpage,
      search,
    },
  });

  return response.data;
};

// Hook principal unificado
export const useOrder = () => {
  const router = useRouter();

  // Hook para listar orders com paginação
  const useOrders = (page: number, perpage: number, search: string) => {
    const { data, error, isLoading, mutate } = useSWR<OrdersResponse>(
      ["get-orders", page, perpage, search],
      () => fetchOrders(page, perpage, search),
    );

    return {
      data,
      isLoading,
      error,
      mutate,
    };
  };

  // Criar order
  const createOrder = useCallback(async (orderData: OrderInputValues) => {
    const response = await api.post("/api/orders", orderData);

    if (response.status !== 201) {
      toast.error(response.data.message, { closeButton: true });
      return response;
    }

    toast.success(`Pedido ${response.data.order_number} criado com sucesso!`, {
      closeButton: true,
    });

    return response;
  }, []);

  // Atualizar order
  const updateOrder = useCallback(
    async (id: string, data: OrderUpdateValues) => {
      const response = await api.patch(`/api/orders/${id}`, data);

      if (response.status !== 200) {
        toast.error(response.data.message, { closeButton: true });
        return response.data;
      }

      toast.success(`Pedido atualizado com sucesso!`, {
        closeButton: true,
      });

      return response.data;
    },
    [],
  );

  // Deletar order
  const deleteOrder = useCallback(async (id: string) => {
    const response = await api.delete(`/api/orders/${id}`);

    if (response.status !== 200) {
      toast.error(response.data.message, { closeButton: true });
      return false;
    }

    toast.success(`Pedido deletado com sucesso!`, {
      closeButton: true,
    });

    return true;
  }, []);

  // Buscar order por ID
  const getOrder = useCallback(async (id: string) => {
    const response = await api.get(`/api/orders/${id}`);

    if (response.status !== 200) {
      toast.error(response.data.message, { closeButton: true });
    }

    return response.data;
  }, []);

  const updateStatus = useCallback(
    async (id_order: string, id_status_order: number) => {
      const response = await api.put(`/api/orders`, {
        id_order,
        id_status_order,
      });
      return response.data;
    },
    [],
  );

  const orderDocumentation = useCallback(
    async (payload: any) => {
      const response = await api.put(`/api/orders/public`, payload);

      if (response.status !== 200) {
        toast.error(response.data.message, { closeButton: true });
        router.refresh();
        return response;
      }

      toast.success(response.data.message, { closeButton: true });

      return response;
    },
    [router],
  );

  const approveOrderDocumentation = useCallback(
    async (id_order: string, id_cond_pag: string) => {
      const payload = {
        id_order,
        id_cond_pag,
      };

      const response = await api.put(`/api/orders/approve-docs`, payload);

      if (response.status !== 200) {
        toast.error(response.data.message, { closeButton: true });
        return response.status;
      }

      toast.success(response.data.message, { closeButton: true });

      return response.status;
    },
    [],
  );

  const sendContract = useCallback(
    async (id_order: string, link_signature: string) => {
      const payload = {
        id_order,
        link_signature,
      };

      const response = await api.put(`/api/orders/send-contract`, payload);

      if (response.status !== 200) {
        toast.error(response.data.message, { closeButton: true });
        return response.status;
      }

      return response.status;
    },
    [],
  );

  const invalidateOrderDocumentation = useCallback(async (id_order: string) => {
    const payload = {
      id_order,
    };

    const response = await api.put(`/api/orders/invalidate-docs`, payload);

    if (response.status !== 200) {
      toast.error(response.data.message, { closeButton: true });
      return response.status;
    }

    toast.success(response.data.message, { closeButton: true });

    return response.status;
  }, []);

  return {
    useOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrder,
    updateStatus,
    orderDocumentation,
    approveOrderDocumentation,
    sendContract,
    invalidateOrderDocumentation,
  };
};

// Manter compatibilidade com hooks existentes
export const useOrders = (page: number, perpage: number, search: string) => {
  return useOrder().useOrders(page, perpage, search);
};
