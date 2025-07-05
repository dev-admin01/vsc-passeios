"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateOrderPayload } from "@/app/hooks/orders/useCreateOrders";
import {
  ServicesSelector,
  ServiceSelection,
} from "@/components/servicesSelection";
import { useCreateOrder } from "@/app/hooks/orders/useCreateOrders";
import { Sidebar } from "@/components/sidebar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCoupons } from "@/app/hooks/orders/useGetCoupons";
import { useCondicaoPagamento } from "@/app/hooks/condicaoPagamento/useCondicaoPagamento";
import { useRouter } from "next/navigation";
import { CondicaoPagamento } from "@/types/condicao-pagamento.types";

export default function NewOrders() {
  const [idUser, setIdUser] = useState<string>("");
  const [price, setPrice] = useState(0);
  const [services, setServices] = useState<ServiceSelection[]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [ddi, setDdi] = useState<string>("");
  const [ddd, setDdd] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [loadingUser, setLoadingUser] = useState(true);
  const { createOrder } = useCreateOrder();
  const [selectedCoupon, setSelectedCoupon] = useState<string>("");
  const { coupons, loading: loadingCoupons } = useGetCoupons();
  const { data: condicoesPagamento, isLoading: loadingCondPag } =
    useCondicaoPagamento();
  const [selectedCondPag, setSelectedCondPag] = useState<string>("");
  const router = useRouter();

  function formatCurrency(value: number): string {
    // Converte o valor para centavos (multiplica por 100)
    const valueInCents = Math.round(value * 100);
    let formattedValue = valueInCents.toString();

    // Garante que temos pelo menos 3 dígitos (para os centavos)
    formattedValue = formattedValue.padStart(3, "0");

    // Separa reais e centavos
    const reais = formattedValue.slice(0, -2);
    const centavos = formattedValue.slice(-2);

    // Formata os reais com separador de milhar
    const reaisFormatados = reais.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Retorna o valor formatado
    return `${reaisFormatados},${centavos}`;
  }

  // Função para formatar telefone
  function formatPhone(value: string): string {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");

    // Limita a 11 dígitos
    const limitedNumbers = numbers.slice(0, 11);

    // Aplica a máscara (9 99999-9999)
    if (limitedNumbers.length <= 1) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return `${limitedNumbers.slice(0, 1)} ${limitedNumbers.slice(1)}`;
    } else {
      return `${limitedNumbers.slice(0, 1)} ${limitedNumbers.slice(1, 6)}-${limitedNumbers.slice(6)}`;
    }
  }

  // Função para remover a máscara do telefone
  function removePhoneMask(value: string): string {
    return value.replace(/\D/g, "");
  }

  useEffect(() => {
    const fetchUserId = async () => {
      setIdUser("1");
      setLoadingUser(false);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const total = services.reduce((acc, service) => {
      const price =
        typeof service.price === "string"
          ? Number(service.price.replace(",", "."))
          : Number(service.price) || 0;
      const discountPercent = Number(service.discount) || 0;
      const quantity = Number(service.quantity) || 1;

      // Calcula o valor com desconto percentual
      const priceWithDiscount = price - price * (discountPercent / 100);

      return acc + priceWithDiscount * quantity;
    }, 0);

    // Aplica desconto do cupom se houver um selecionado
    let finalPrice = total;
    if (selectedCoupon) {
      const coupon = coupons.find((c) => c.id_coupons === selectedCoupon);
      if (coupon) {
        finalPrice = total - total * (Number(coupon.discount) / 100);
      }
    }

    setPrice(finalPrice);
  }, [services, selectedCoupon, coupons]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loadingUser || !idUser) {
      toast.error(
        "Aguardando carregamento do usuário. Por favor, tente novamente em instantes.",
      );
      return;
    }

    const newOrder: CreateOrderPayload = {
      id_user: idUser,
      pre_name: name,
      pre_email: email,
      pre_ddi: ddi,
      pre_ddd: ddd,
      pre_phone: phone,
      price: price.toString(),
      id_cond_pag: selectedCondPag ? selectedCondPag : "",
      id_coupons: selectedCoupon ? selectedCoupon : "",
      services: services
        .filter((service) => service.id_service !== undefined)
        .map((service) => ({
          id_service: service.id_service!,
          price: service.price?.toString() || "0",
          quantity: service.quantity ?? 1,
          discount: service.discount ?? 0,
          suggested_date: service.suggestedDate
            ? new Date(service.suggestedDate).toISOString()
            : undefined,
          time: service.time?.[0] || undefined,
        })),
    };

    try {
      console.log("newOrder", newOrder);
      const response = await createOrder(newOrder);
      localStorage.setItem(
        "orderSuccessMessage",
        response.message || "Orçamento criado com sucesso!",
      );
      router.push("/orders");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao criar orçamento");
    }
  };

  return (
    <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
      <Sidebar />
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Novo Orçamento</h1>
        <Button className="cursor-pointer">
          <Link href="/orders" title="Voltar">
            <ArrowLeft />
          </Link>
        </Button>
      </div>

      <div className="bg-white p-4 rounded shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-wrap">
          <div className="flex flex-wrap">
            <div className="w-1/2 p-2">
              <label className="font-semibold">Nome:</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-1/2 p-2">
              <label className="font-semibold">Email:</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="w-1/8 p-2">
              <label className="font-semibold">DDI:</label>
              <Input
                type="text"
                value={ddi}
                onChange={(e) => setDdi(e.target.value)}
              />
            </div>
            <div className="w-1/8 p-2">
              <label className="font-semibold">DDD:</label>
              <Input
                type="text"
                value={ddd}
                onChange={(e) => setDdd(e.target.value)}
              />
            </div>
            <div className="w-1/4 p-2">
              <label className="font-semibold">Telefone:</label>
              <Input
                type="text"
                value={formatPhone(phone)}
                onChange={(e) => setPhone(removePhoneMask(e.target.value))}
                maxLength={12}
              />
            </div>
          </div>
          <div className="flex flex-wrap w-full">
            <div className="w-1/3 p-2">
              <label className="font-semibold ">Cupom de Desconto:</label>
              <Select value={selectedCoupon} onValueChange={setSelectedCoupon}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um cupom" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum cupom</SelectItem>
                  {loadingCoupons ? (
                    <SelectItem value="loading" disabled>
                      Carregando cupons...
                    </SelectItem>
                  ) : (
                    coupons.map((coupon) => (
                      <SelectItem
                        key={coupon.id_coupons}
                        value={coupon.id_coupons}
                      >
                        {coupon.coupon} - {coupon.discount} (%)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/3 p-2">
              <label className="font-semibold ">Condição de Pagamento:</label>
              <Select
                value={selectedCondPag}
                onValueChange={setSelectedCondPag}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma condição de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma condição</SelectItem>
                  {loadingCondPag ? (
                    <SelectItem value="loading" disabled>
                      Carregando condições de pagamento...
                    </SelectItem>
                  ) : (
                    condicoesPagamento?.condicoesPagamento.map(
                      (condPag: CondicaoPagamento) => {
                        if (
                          condPag.description !== "Pix" &&
                          condPag.description !== "Pix" &&
                          condPag.description !== "pix" &&
                          condPag.description !== "PIX"
                        ) {
                          return (
                            <SelectItem
                              key={condPag.id_cond_pag}
                              value={condPag.id_cond_pag.toString()}
                            >
                              {condPag.description} - {condPag.installments}{" "}
                              parcelas
                            </SelectItem>
                          );
                        }
                        return null;
                      },
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/3 p-2">
              <label className="font-semibold">Preço Total (R$):</label>
              <Input type="text" value={formatCurrency(price)} readOnly />
            </div>
          </div>

          <div className="w-full p-2">
            <ServicesSelector onChange={setServices} />
          </div>

          <div className="flex justify-end gap-2 mt-4 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancelar
            </Button>
            <Button type="submit">Criar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
