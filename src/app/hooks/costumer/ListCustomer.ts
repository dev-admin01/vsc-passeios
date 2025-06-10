import useSWR from "swr";
import { api } from "@/services/api";
import { ListCustomerResponse } from "@/types/custumer.type";
import { getCookieclient } from "@/lib/cookieClient";

const fetchCustomers = async (
  page: number,
  perpage: number,
  search: string
) => {
  const token = await getCookieclient();
  const response = await api.get<ListCustomerResponse>("/api/customers", {
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

export function useCustomer(page: number, perpage: number, search: string) {
  const { data, error, isLoading, mutate } = useSWR<ListCustomerResponse>(
    ["get-customers", page, perpage, search],
    () => fetchCustomers(page, perpage, search)
  );

  return { data, error, isLoading, mutate };
}
