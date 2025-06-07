"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface RegisterLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderNumber: string;
  isLoading: boolean;
}

export function RegisterLinkModal({
  isOpen,
  onClose,
  onConfirm,
  orderNumber,
  isLoading,
}: RegisterLinkModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-4 rounded shadow-md max-w-md w-full">
        <h3 className="text-lg font-bold mb-2">Enviar link de cadastro?</h3>
        <p>
          Tem certeza que deseja enviar o cadastro do orçamento
          <span className="font-bold"> {orderNumber} </span>
          para o cliente?
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Enviar"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
