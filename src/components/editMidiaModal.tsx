"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMidia, Midia } from "@/app/hooks/midia/useMidia";

interface EditMidiaModalProps {
  midia: Midia;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditMidiaModal({
  midia,
  isOpen,
  onClose,
  onSuccess,
}: EditMidiaModalProps) {
  const [description, setDescription] = useState(midia.description);
  const { updateMidia } = useMidia();

  useEffect(() => {
    setDescription(midia.description);
  }, [midia]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedMidia = await updateMidia(midia.id_midia, description);
    if (updatedMidia) {
      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Mídia</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite a descrição da mídia"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
