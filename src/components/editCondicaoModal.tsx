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
import {
  useCondicaoPagamento,
  CondicaoPagamento,
} from "@/app/hooks/condicaoPagamento/useCondicaoPagamento";

interface EditCondicaoModalProps {
  condicao: CondicaoPagamento;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditCondicaoModal({
  condicao,
  isOpen,
  onClose,
  onSuccess,
}: EditCondicaoModalProps) {
  const [description, setDescription] = useState(condicao.description);
  const [installments, setInstallments] = useState(condicao.installments);
  const [discount, setDiscount] = useState(condicao.discount);
  const { updateCondicao } = useCondicaoPagamento();

  useEffect(() => {
    setDescription(condicao.description);
    setInstallments(condicao.installments);
    setDiscount(condicao.discount);
  }, [condicao]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCondicao = await updateCondicao(
      condicao.id_cond_pag,
      description,
      installments,
      discount
    );
    if (updatedCondicao) {
      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Condição de Pagamento</DialogTitle>
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
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
