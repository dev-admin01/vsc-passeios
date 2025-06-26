"use client";

import useSWR from "swr";
import { api } from "@/services/api";
import { toast } from "sonner";
import { getCookieclient } from "@/lib/cookieClient";

export interface CondicaoPagamento {
  id_cond_pag: string;
  description: string;
  installments: string;
  discount: string;
  created_at: string;
  updated_at: string;
}

export interface GetCondicaoPagamentoResponse {
  message: string;
  condicoesPagamento: CondicaoPagamento[];
  status_code: number;
}

export interface CreateCondicaoPagamentoResponse {
  message: string;
  condicaoPagamento: CondicaoPagamento;
  status_code: number;
}

const fetchCondicoes = async (
  page: number,
  perpage: number,
  search: string,
) => {
  const token = await getCookieclient();
  const response = await api.get<GetCondicaoPagamentoResponse>(
    "/api/condicao-pagamento",
    {
      params: { page, perpage, search },
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};

export function useCondicaoPagamento(
  page: number = 1,
  perpage: number = 10,
  search: string = "",
) {
  const { data, error, isLoading, mutate } =
    useSWR<GetCondicaoPagamentoResponse>(
      ["get-condicoes", page, perpage, search],
      () => fetchCondicoes(page, perpage, search),
    );

  const createCondicao = async (
    description: string,
    installments: string,
    discount: string,
  ): Promise<CondicaoPagamento | null> => {
    try {
      const token = await getCookieclient();
      const response = await api.post<CreateCondicaoPagamentoResponse>(
        "/api/condicao-pagamento",
        { description, installments, discount },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.status === 201) {
        toast.success(response.data.message);
        mutate();
        return response.data.condicaoPagamento;
      }
      return null;
    } catch (error) {
      console.error("Erro ao criar condição de pagamento:", error);
      toast.error("Erro ao criar condição de pagamento");
      return null;
    }
  };

  const updateCondicao = async (
    id: string,
    description: string,
    installments: string,
    discount: string,
  ): Promise<CondicaoPagamento | null> => {
    try {
      const token = await getCookieclient();
      const response = await api.put<CreateCondicaoPagamentoResponse>(
        `/api/condicao-pagamento/${id}`,
        { description, installments, discount },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        mutate();
        return response.data.condicaoPagamento;
      }
      return null;
    } catch (error) {
      console.error("Erro ao atualizar condição de pagamento:", error);
      toast.error("Erro ao atualizar condição de pagamento");
      return null;
    }
  };

  const deleteCondicao = async (id: string): Promise<boolean> => {
    try {
      const token = await getCookieclient();
      const response = await api.delete(`/api/condicao-pagamento/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        toast.success("Condição de pagamento excluída com sucesso!");
        mutate();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao excluir condição de pagamento:", error);
      toast.error("Erro ao excluir condição de pagamento");
      return false;
    }
  };

  return {
    data,
    error,
    isLoading,
    createCondicao,
    updateCondicao,
    deleteCondicao,
  };
}
