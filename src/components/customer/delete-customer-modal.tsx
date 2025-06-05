"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDeleteCustomer } from "@/app/hooks/costumer/useDeleteCustomer"
import { useState } from "react"

interface DeleteCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  customerId: string
  customerName: string
}

export function DeleteCustomerModal({
  isOpen,
  onClose,
  customerId,
  customerName,
}: DeleteCustomerModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { deleteCustomer } = useDeleteCustomer()

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      await deleteCustomer(customerId)
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Cliente</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o cliente {customerName}? Esta ação não
            pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 