"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteMidiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteMidiaModal({
  isOpen,
  onClose,
  onConfirm,
}: DeleteMidiaModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Mídia</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir esta mídia? Esta ação não pode ser
            desfeita.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Excluir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
