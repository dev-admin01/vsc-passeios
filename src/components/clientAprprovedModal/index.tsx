"use client";

import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";

interface ClientApprovedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApproved: () => void;
  onRejected: () => void;
  orderNumber: string;
  isLoading?: boolean;
}

export function ClientApprovedModal({
  isOpen,
  onClose,
  onApproved,
  onRejected,
  orderNumber,
  isLoading = false,
}: ClientApprovedModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-4 rounded shadow-md max-w-md w-full relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onClose}
          disabled={isLoading}
        >
          <X className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-bold mb-4 pr-8">
          Atualizar orçamento pós avaliação do cliente
        </h3>
        <p className="mb-5 text-sm">
          Deseja atualizar o status do orçamento {orderNumber}?
        </p>
        <div className="flex justify-between gap-2 mt-4">
          <Button
            variant="destructive"
            onClick={onRejected}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Orçamento reprovado"
            )}
          </Button>
          <Button
            className="bg-green-500 hover:bg-green-600"
            onClick={onApproved}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Orçamento aprovado"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
