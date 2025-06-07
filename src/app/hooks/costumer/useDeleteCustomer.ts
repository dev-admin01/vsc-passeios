import { api } from "@/services/api";
import { mutate } from "swr";

export function useDeleteCustomer() {
  const deleteCustomer = async (customerId: string) => {
    await api.delete(`/customers/${customerId}`);
    await mutate("/customers");
  };

  return { deleteCustomer };
}
