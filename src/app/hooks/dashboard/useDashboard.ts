import { api } from "@/services/api";
import useSWR from "swr";

const fetchDashboard = async (
  url: string,
  id_user: string,
  id_position: number,
) => {
  if (!id_user || !id_position) {
    return null;
  }
  const response = await api.get("/api/dashboard", {
    headers: {
      "x-user-id": id_user,
      "x-user-position": id_position,
    },
  });
  return response.data;
};

export function useDashboard(
  id_user: string | null,
  id_position: number | null,
) {
  const { data, isLoading, error, mutate } = useSWR(
    id_user && id_position ? ["dashboard", id_user, id_position] : null,
    ([url, id_user, id_position]) => fetchDashboard(url, id_user, id_position),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  return { data, isLoading, error, mutate };
}
