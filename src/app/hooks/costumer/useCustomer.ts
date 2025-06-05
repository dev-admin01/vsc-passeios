import useSWR from "swr"
import { api } from "@/lib/axios"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  createdAt: string
}

export function useCustomer() {
  const { data: customers, isLoading } = useSWR<Customer[]>(
    "/customers",
    async (url) => {
      const response = await api.get(url)
      return response.data
    }
  )

  return { customers, isLoading }
} 