import { api } from "@/services/api";
import { mutate } from "swr";

interface UpdateCustomerData {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export function useUpdateCustomer() {
  const updateCustomer = async (data: UpdateCustomerData) => {
    const { id, ...rest } = data;
    const response = await api.put(`/api/customers/${id}`, rest);
    await mutate("/api/customers");
    return response.data;
  };

  return { updateCustomer };
}
