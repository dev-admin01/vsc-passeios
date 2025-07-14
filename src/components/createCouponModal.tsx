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
import { useCoupon } from "@/app/hooks/coupons/useCoupon";
import { useMidia } from "@/app/hooks/midia/useMidia";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

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
  const [active, setActive] = useState(true);
  const { createCoupon } = useCoupon(1, 10, "");
  const { data: midiasData } = useMidia(1, 100, "");
  const [isLoading, setIsLoading] = useState(false);

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove qualquer caractere que não seja número
    const numbersOnly = value.replace(/[^\d]/g, "");
    const forString = numbersOnly.toString();
    setDiscount(forString);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await createCoupon({
      coupon,
      discount: discount,
      id_midia: Number(idMidia),
      active,
    });

    if (success) {
      setCoupon("");
      setDiscount("");
      setIdMidia("");
      setActive(true);
      onSuccess();
      onClose();
      setIsLoading(false);
    }

    if (!success) {
      setIsLoading(false);
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
              maxLength={15}
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
              maxLength={3}
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
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <Label htmlFor="active">Cupom ativo</Label>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="cursor-pointer flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                "Criar"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
