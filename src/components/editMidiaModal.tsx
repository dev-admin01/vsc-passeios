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
import { useMidia } from "@/app/hooks/midia/useMidia";
import { Midia } from "@/types/midia.types";

import { Loader2 } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDescription(midia.description);
  }, [midia]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const updatedMidia = await updateMidia(midia.id_midia!, description);

    if (updatedMidia) {
      onSuccess();
      onClose();
      setIsLoading(false);
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
