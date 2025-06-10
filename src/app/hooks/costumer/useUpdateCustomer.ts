import { api } from "@/services/api";
import { CustomerFormData } from "@/app/customers/customer-form";
import { getCookieclient } from "@/lib/cookieClient";

export const useUpdateCustomer = () => {
  const updateCustomer = async (id: string, data: CustomerFormData) => {
    const token = await getCookieclient();
    const response = await api.put(`/api/customers/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  return { updateCustomer };
};
