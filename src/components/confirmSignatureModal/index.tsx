"use client";

import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";

interface ConfirmSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderNumber: string;
  isLoading: boolean;
}

export function ConfirmSignatureModal({
  isOpen,
  onClose,
  onConfirm,
  orderNumber,
  isLoading,
}: ConfirmSignatureModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-4 rounded shadow-md max-w-md w-full relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <h3 className="text-lg font-bold mb-2 pr-8">Confirmar Assinatura</h3>
        <p>
          Tem certeza que deseja confirmar a assinatura do contrato do orçamento{" "}
          <span className="font-bold">{orderNumber}</span>?
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Esta ação irá finalizar o processo e marcar o contrato como assinado.
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="default" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Confirmar Assinatura"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
