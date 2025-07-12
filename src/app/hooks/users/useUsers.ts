import { useState } from "react";
import { api } from "@/services/api";
import { toast } from "sonner";
import useSWR from "swr";
import { User } from "@/types/user.types";

// Fetcher para SWR
const fetcher = (url: string) => api.get(url).then((res) => res.data);

// Hook para listar usuários com paginação
export function useUsers(
  page: number = 1,
  perpage: number = 10,
  search: string = "",
) {
  const params = new URLSearchParams({
    page: page.toString(),
    perpage: perpage.toString(),
    ...(search && { search }),
  });

  return useSWR(`/api/users?${params}`, fetcher);
}

// Hook para buscar um usuário específico
export function useUser(id: string) {
  return useSWR(id ? `/api/users/${id}` : null, fetcher);
}

// Hook para criar usuário
export function useCreateUser() {
  const [isLoading, setIsLoading] = useState(false);

  const createUser = async (
    userData: Omit<User, "id_user" | "created_at" | "updated_at">,
  ) => {
    setIsLoading(true);
    try {
      const response = await api.post("/api/users", userData);

      if (response.status === 201) {
        toast.success("Usuário criado com sucesso!");
        return response.data;
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Dados inválidos");
      } else {
        toast.error("Erro ao criar usuário");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { createUser, isLoading };
}

// Hook para atualizar usuário
export function useUpdateUser() {
  const [isLoading, setIsLoading] = useState(false);

  const updateUser = async (id: string, userData: Partial<User>) => {
    setIsLoading(true);
    try {
      const response = await api.put(`/api/users/${id}`, userData);

      if (response.status === 200) {
        toast.success("Usuário atualizado com sucesso!");
        return response.data;
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Dados inválidos");
      } else if (error.response?.status === 404) {
        toast.error("Usuário não encontrado");
      } else {
        toast.error("Erro ao atualizar usuário");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateUser, isLoading };
}

// Hook para deletar usuário
export function useDeleteUser() {
  const [isLoading, setIsLoading] = useState(false);

  const deleteUser = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await api.delete(`/api/users/${id}`);

      if (response.status === 200) {
        toast.success("Usuário excluído com sucesso!");
        return response.data;
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error("Usuário não encontrado");
      } else {
        toast.error("Erro ao excluir usuário");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteUser, isLoading };
}

// Hook para toggle active/inactive do usuário
export function useToggleUser() {
  const [isLoading, setIsLoading] = useState(false);

  const toggleUser = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await api.patch(`/api/users/${id}`);

      if (response.status === 200) {
        toast.success("Status do usuário alterado com sucesso!");
        return response.data;
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error("Usuário não encontrado");
      } else if (error.response?.status === 400) {
        toast.error(
          error.response.data.message || "Erro ao alterar status do usuário",
        );
      } else {
        toast.error("Erro ao alterar status do usuário");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { toggleUser, isLoading };
}
