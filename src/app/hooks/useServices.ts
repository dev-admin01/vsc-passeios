"use client";
import useSWR from "swr";
// import { api } from "@/services/api";

import { getCookieclient } from "@/lib/cookieClient";
import { Services } from "@/types/service.types";


const fetchServices = async (
  page: number,
  limit: number,
  search: string
): Promise<Services[]> => {
  const token = await getCookieclient();

  const response = await fetch(
    `http://localhost:3000/api/v1/services?page=${page}&limit=${limit}&search=${search}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },

    }
  );

  const responseBody = await response.json();
  console.log("fetch:", responseBody);
  return responseBody.data;
};

export const useServices = (page: number, limit: number, search: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    ["get-services", page, limit, search],
    () => fetchServices(page, limit, search)
  );

  console.log("hook", mutate);

  return {
    data,
    isLoading,
    error,
    mutate,
  };
};
