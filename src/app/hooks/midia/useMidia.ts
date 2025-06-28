"use client";

import useSWR from "swr";
import { api } from "@/services/api";
import { toast } from "sonner";
import { Midia } from "@/types/midia.types";
import { ErrorOptions } from "@/errors/errors";

export interface GetMidiaResponse {
  midias: Midia[];
  page: number;
  perpage: number;
  totalCount: number;
  lastPage: number;
}

export interface DeleteMidiaResponse {
  message: string;
  status_code: number;
}

const fetchMidias = async (page: number, perpage: number, search: string) => {
  const response = await api.get<GetMidiaResponse>("/api/midia", {
    params: { page, perpage, search },
  });
  return response.data;
};

export function useMidia(
  page: number = 1,
  perpage: number = 10,
  search: string = ""
) {
  const { data, error, isLoading, mutate } = useSWR<GetMidiaResponse>(
    ["get-midias", page, perpage, search],
    () => fetchMidias(page, perpage, search)
  );

  const createMidia = async (description: string): Promise<Midia | null> => {
    try {
      const response = await api.post<Midia>("/api/midia", {
        description,
      });

      if (response.status === 201) {
        toast.success("Mídia criada com sucesso!");
        mutate();
        return {
          id_midia: response.data.id_midia,
          description: response.data.description,
          created_at: response.data.created_at,
        };
      }
      return null;
    } catch (error) {
      console.error("Erro ao criar mídia:", error);
      toast.error("Erro ao criar mídia");
      return null;
    }
  };

  const updateMidia = async (
    id: number,
    description: string
  ): Promise<Midia | ErrorOptions | null> => {
    try {
      const response = await api.patch<Midia>(`/api/midia/${id}`, {
        description,
      });

      if (response.status !== 200) {
        toast.error("Erro ao atualizar mídia");
        return response.data;
      }

      if (response.status === 200) {
        toast.success("Mídia atualizada com sucesso!");
        mutate();
        return response.data;
      }
      return response.data;
    } catch (error: any) {
      console.error("Erro ao atualizar mídia:", error);
      toast.error(error.response?.data?.message || "Erro ao atualizar mídia");
      return error.response?.data;
    }
  };

  const deleteMidia = async (id: number): Promise<boolean> => {
    try {
      const response = await api.delete<DeleteMidiaResponse>(
        `/api/midia/${id}`
      );

      if (response.status === 200) {
        toast.success(response.data.message || "Mídia excluída com sucesso!");
        mutate();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao excluir mídia:", error);
      toast.error("Erro ao excluir mídia");
      return false;
    }
  };

  return {
    data,
    error,
    isLoading,
    createMidia,
    updateMidia,
    deleteMidia,
  };
}
