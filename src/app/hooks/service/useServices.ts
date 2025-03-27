"use client";

import useSWR from "swr";
import { api } from "@/services/api";

import { getCookieclient } from "@/lib/cookieClient";
import { ServicesResponse } from "@/types/service.types";

// Exemplo de interface de retorno da API.
// Ajuste conforme seu backend estiver retornando os campos:

// Função que faz a requisição usando axios:
const fetchServices = async (page: number, perpage: number, search: string) => {
  // Buscar o token
  const token = await getCookieclient();

  // Fazer a requisição para /services
  // Passando query params e Bearer Token
  const response = await api.get<ServicesResponse>("/services", {
    params: {
      page,
      perpage,
      search,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Hook que faz a chamada via SWR:
export const useServices = (page: number, perpage: number, search: string) => {
  // A chave do SWR será o array com strings e valores que mudam a cada nova consulta
  const { data, error, isLoading, mutate } = useSWR<ServicesResponse>(
    ["get-services", page, perpage, search],
    () => fetchServices(page, perpage, search)
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
};
