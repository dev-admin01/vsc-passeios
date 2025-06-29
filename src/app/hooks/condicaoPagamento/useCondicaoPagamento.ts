"use client";

import useSWR from "swr";
import { api } from "@/services/api";
import { toast } from "sonner";
import { CondicaoPagamento } from "@/types/condicao-pagamento.types";

export interface GetCondicaoPagamentoResponse {
  condicoesPagamento: CondicaoPagamento[];
  page: number;
  perpage: number;
  totalCount: number;
  lastPage: number;
}

export interface DeleteCondicaoPagamentoResponse {
  message: string;
  status_code: number;
}

const fetchCondicoes = async (
  page: number,
  perpage: number,
  search: string,
) => {
  const response = await api.get<GetCondicaoPagamentoResponse>(
    "/api/condicao-pagamento",
    {
      params: { page, perpage, search },
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

  const createCondicao = async (condicaoData: {
    description: string;
    installments: string;
    discount: string;
  }): Promise<any> => {
    const response = await api.post("/api/condicao-pagamento", condicaoData);

    if (response.status !== 201) {
      toast.error(response.data.message);
      return false;
    }

    toast.success(
      `Condição de pagamento ${condicaoData.description} criada com sucesso!`,
    );
    mutate();
    return response.data;
  };

  const updateCondicao = async (
    id: string,
    condicaoData: {
      description: string;
      installments: string;
      discount: string;
    },
  ): Promise<any> => {
    const response = await api.patch(
      `/api/condicao-pagamento/${id}`,
      condicaoData,
    );

    if (response.status !== 200) {
      toast.error(response.data.message);
      return false;
    }

    toast.success(
      `Condição de pagamento ${condicaoData.description} atualizada com sucesso!`,
    );
    mutate();
    return response.data;
  };

  const deleteCondicao = async (id: string): Promise<boolean> => {
    try {
      const response = await api.delete<DeleteCondicaoPagamentoResponse>(
        `/api/condicao-pagamento/${id}`,
      );

      if (response.status === 200) {
        toast.success(
          response.data.message ||
            "Condição de pagamento excluída com sucesso!",
        );
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
