import { api } from "@/lib/axios"
import { mutate } from "swr"

interface CreateCustomerData {
  name: string
  email: string
  phone: string
}

export function useCreateCustomer() {
  const createCustomer = async (data: CreateCustomerData) => {
    const response = await api.post("/customers", data)
    await mutate("/customers")
    return response.data
  }

  return { createCustomer }
} 