"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SendContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (link: string) => void;
  orderNumber: string;
  isLoading: boolean;
}

export function SendContractModal({
  isOpen,
  onClose,
  onConfirm,
  orderNumber,
  isLoading,
}: SendContractModalProps) {
  const [link, setLink] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-4 rounded shadow-md max-w-md w-full">
        <h3 className="text-lg font-bold mb-2">Enviar contrato?</h3>
        <p>
          Tem certeza que deseja enviar o recibo de pagamento e contrato do
          orçamento <span className="font-bold"> {orderNumber} </span> para o
          cliente?
        </p>
        <div className="w-full p-2">
          <label className="font-semibold">Link para assinatura:</label>
          <Input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (!link.trim()) {
                toast.error(
                  "Por favor, insira o link para assinatura de contrato",
                );
                return;
              }
              onConfirm(link);
            }}
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
