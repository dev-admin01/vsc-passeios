import { api } from "@/lib/axios"
import { mutate } from "swr"

export function useDeleteCustomer() {
  const deleteCustomer = async (customerId: string) => {
    await api.delete(`/customers/${customerId}`)
    await mutate("/customers")
  }

  return { deleteCustomer }
} 