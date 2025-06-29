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
import { useCoupons } from "@/app/hooks/coupons/useCoupons";
import { useMidia } from "@/app/hooks/midia/useMidia";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateCouponModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateCouponModalProps) {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState("");
  const [idMidia, setIdMidia] = useState("");
  const { createCoupon } = useCoupons(1, 10, "");
  const { data: midiasData } = useMidia(1, 100, "");

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove qualquer caractere que não seja número
    const numbersOnly = value.replace(/[^\d]/g, "");
    const forString = numbersOnly.toString();
    setDiscount(forString);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createCoupon({
      coupon,
      discount: discount,
      id_midia: Number(idMidia),
    });

    if (success) {
      setCoupon("");
      setDiscount("");
      setIdMidia("");
      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Cupom</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="coupon">Cupom</Label>
            <Input
              id="coupon"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Digite o código do cupom"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount">Desconto (%)</Label>
            <Input
              id="discount"
              type="text"
              value={discount}
              onChange={handleDiscountChange}
              placeholder="Digite o percentual de desconto"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="midia">Mídia</Label>
            <Select value={idMidia} onValueChange={setIdMidia} required>
              <SelectTrigger className="bg-white w-full">
                <SelectValue placeholder="Selecione uma mídia" />
              </SelectTrigger>
              <SelectContent>
                {midiasData?.midias.map((midia) => (
                  <SelectItem
                    key={midia.id_midia}
                    value={midia.id_midia?.toString() || ""}
                  >
                    {midia.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-4">
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
