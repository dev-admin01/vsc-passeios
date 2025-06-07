import useSWR from "swr";
import { api } from "@/services/api";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export function useCustomer() {
  const { data: customers, isLoading } = useSWR<Customer[]>(
    "/customers",
    async () => {
      const response = await api.get("/customers");
      return response.data;
    }
  );

  return { customers, isLoading };
}
