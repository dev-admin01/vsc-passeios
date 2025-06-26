"use client";

import useSWR from "swr";
import { api } from "@/services/api";
import { toast } from "sonner";
import { getCookieclient } from "@/lib/cookieClient";

export interface Midia {
  id_midia: number;
  description: string;
  created_at: string;
}

export interface GetMidiaResponse {
  message: string;
  midias: Midia[];
  status_code: number;
}

export interface CreateMidiaResponse {
  message: string;
  midia: Midia;
  status_code: number;
}

const fetchMidias = async (page: number, perpage: number, search: string) => {
  const token = await getCookieclient();
  const response = await api.get<GetMidiaResponse>("/api/midia", {
    params: { page, perpage, search },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export function useMidia(
  page: number = 1,
  perpage: number = 10,
  search: string = "",
) {
  const { data, error, isLoading, mutate } = useSWR<GetMidiaResponse>(
    ["get-midias", page, perpage, search],
    () => fetchMidias(page, perpage, search),
  );

  const createMidia = async (description: string): Promise<Midia | null> => {
    try {
      const token = await getCookieclient();
      const response = await api.post<CreateMidiaResponse>(
        "/api/midia",
        { description },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.status === 201) {
        toast.success("Mídia criada com sucesso!");
        mutate();
        return response.data.midia;
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
    description: string,
  ): Promise<Midia | null> => {
    try {
      const token = await getCookieclient();
      const response = await api.put<CreateMidiaResponse>(
        `/api/midia/${id}`,
        { description },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.status === 200) {
        toast.success("Mídia atualizada com sucesso!");
        mutate();
        return response.data.midia;
      }
      return null;
    } catch (error) {
      console.error("Erro ao atualizar mídia:", error);
      toast.error("Erro ao atualizar mídia");
      return null;
    }
  };

  const deleteMidia = async (id: number): Promise<boolean> => {
    try {
      const token = await getCookieclient();
      const response = await api.delete(`/api/midia/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        toast.success("Mídia excluída com sucesso!");
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
