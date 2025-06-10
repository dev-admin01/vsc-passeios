import { api } from "@/services/api";
import { mutate } from "swr";
import { CreateCustomerData } from "@/types/custumer.type";
import { getCookieclient } from "@/lib/cookieClient";

export function useCreateCustomer() {
  const createCustomer = async (data: CreateCustomerData) => {
    const token = await getCookieclient();
    data.cpf_cnpj = data.cpf_cnpj.replace(/\D/g, "");
    data.telefone = data.telefone.replace(/\D/g, "");
    console.log(data);
    const response = await api.post("/api/customers", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await mutate("/customers");
    console.log(response.data);
    return response.data;
  };

  return { createCustomer };
}
