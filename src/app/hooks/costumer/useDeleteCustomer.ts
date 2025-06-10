import { api } from "@/services/api";
import { mutate } from "swr";

export function useDeleteCustomer() {
  const deleteCustomer = async (customerId: string) => {
    await api.delete(`/api/customers/${customerId}`);
    await mutate("/api/customers");
  };

  return { deleteCustomer };
}
