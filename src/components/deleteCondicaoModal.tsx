"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DeleteCondicaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeleteCondicaoModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeleteCondicaoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Condição de Pagamento</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir esta condição de pagamento? Esta ação
            não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="cursor-pointer flex items-center"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Excluir"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
