import { api } from "@/services/api";
import useSWR from "swr";

const fetchDashboard = async () => {
  const response = await api.get("/api/dashboard");
  return response.data;
};

export function useDashboard() {
  const { data, isLoading, error, mutate } = useSWR(
    "dashboard",
    fetchDashboard
  );

  return { data, isLoading, error, mutate };
}
