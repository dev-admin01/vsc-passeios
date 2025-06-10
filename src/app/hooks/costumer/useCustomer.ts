import { api } from "@/services/api";
import { GetCustomerResponse } from "@/types/custumer.type";
import { getCookieclient } from "@/lib/cookieClient";

export const fetchCustomer = async (id: string) => {
  const token = await getCookieclient();
  const response = await api.get<GetCustomerResponse>(`/api/customers/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("cliente hook", response.data);
  return response.data;
};
