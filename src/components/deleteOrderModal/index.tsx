"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DeleteOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteOrderModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteOrderModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-4 rounded shadow-md max-w-md w-full">
        <h3 className="text-lg font-bold mb-2">Confirmar Exclusão</h3>
        <p>Tem certeza que deseja excluir este order?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Excluir"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
