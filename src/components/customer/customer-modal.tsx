"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCreateCustomer } from "@/app/hooks/costumer/useCreateCustomer"
import { useUpdateCustomer } from "@/app/hooks/costumer/useUpdateCustomer"
import { useState } from "react"

const customerFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "Telefone é obrigatório"),
})

type CustomerFormValues = z.infer<typeof customerFormSchema>

interface CustomerModalProps {
  isOpen: boolean
  onClose: () => void
  customer?: {
    id: string
    name: string
    email: string
    phone: string
  }
}

export function CustomerModal({ isOpen, onClose, customer }: CustomerModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { createCustomer } = useCreateCustomer()
  const { updateCustomer } = useUpdateCustomer()

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: customer?.name ?? "",
      email: customer?.email ?? "",
      phone: customer?.phone ?? "",
    },
  })

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      setIsLoading(true)
      if (customer) {
        await updateCustomer({ id: customer.id, ...data })
      } else {
        await createCustomer(data)
      }
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {customer ? "Editar Cliente" : "Novo Cliente"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email do cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="Telefone do cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {customer ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 