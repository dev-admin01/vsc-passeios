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
import { useCoupons } from "@/app/hooks/coupons/useCoupons";
import { useMidia } from "@/app/hooks/midia/useMidia";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Coupon } from "@/app/hooks/coupons/useCoupons";

interface EditCouponModalProps {
  coupon: Coupon;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditCouponModal({
  coupon,
  isOpen,
  onClose,
  onSuccess,
}: EditCouponModalProps) {
  const [couponCode, setCouponCode] = useState(coupon.coupon);
  const [discount, setDiscount] = useState(coupon.discount.toString());
  const [idMidia, setIdMidia] = useState(coupon.id_midia.toString());
  const { updateCoupon } = useCoupons(1, 10, "");
  const { data: midiasData } = useMidia(1, 100, "");

  useEffect(() => {
    setCouponCode(coupon.coupon);
    setDiscount(coupon.discount.toString());
    setIdMidia(coupon.id_midia.toString());
  }, [coupon]);

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove qualquer caractere que não seja número
    const numbersOnly = value.replace(/[^\d]/g, "");
    const forString = numbersOnly.toString();
    setDiscount(forString);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateCoupon(coupon.id_coupons, {
      coupon: couponCode,
      discount: discount,
      id_midia: Number(idMidia),
    });

    if (success) {
      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Cupom</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="coupon">Cupom</Label>
            <Input
              id="coupon"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
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
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma mídia" />
              </SelectTrigger>
              <SelectContent>
                {midiasData?.midias.map((midia) => (
                  <SelectItem
                    key={midia.id_midia}
                    value={midia.id_midia.toString()}
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
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
