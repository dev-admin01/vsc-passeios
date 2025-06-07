"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCondicaoPagamento } from "@/app/hooks/condicaoPagamento/useCondicaoPagamento";

interface CreateCondicaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateCondicaoModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateCondicaoModalProps) {
  const [description, setDescription] = useState("");
  const [installments, setInstallments] = useState("");
  const [discount, setDiscount] = useState("");
  const { createCondicao } = useCondicaoPagamento();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const condicao = await createCondicao(description, installments, discount);
    if (condicao) {
      setDescription("");
      setInstallments("");
      setDiscount("");
      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Condição de Pagamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite a descrição"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="installments">Parcelas</Label>
            <Input
              id="installments"
              value={installments}
              onChange={(e) => setInstallments(e.target.value)}
              placeholder="Digite o número de parcelas"
              required
              maxLength={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount">Desconto (%)</Label>
            <Input
              id="discount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="Digite o desconto"
              required
              maxLength={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Criar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
