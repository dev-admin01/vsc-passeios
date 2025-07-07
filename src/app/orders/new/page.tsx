"use client";

import { useAuthContext } from "@/app/contexts/authContext";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OrderInputValues } from "@/models/order";
import {
  ServicesSelector,
  ServiceSelection,
} from "@/components/servicesSelection";
import { useOrder } from "@/app/hooks/orders/useOrder";
import { Sidebar } from "@/components/sidebar";
import { ArrowLeft, Loader2 } from "lucide-react";
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
import { useCustomer } from "@/app/hooks/costumer/useCostumer";

export default function NewOrders() {
  const { user, loading } = useAuthContext();
  const { useCustomers } = useCustomer();
  const [idUser, setIdUser] = useState<string>("");
  const [isClientNotFound, setIsClientNotFound] = useState(false);
  const [id_customer, setIdCustomer] = useState<string | null>(null);
  const [price, setPrice] = useState(0);
  const [services, setServices] = useState<ServiceSelection[]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [cpfCnpj, setCpfCnpj] = useState<string>("");
  const [ddi, setDdi] = useState<string>("");
  const [ddd, setDdd] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [loadingUser, setLoadingUser] = useState(false);
  const { createOrder } = useOrder();
  const [createOrderLoading, setCreateOrderLoading] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<string>("none");
  const { coupons, loading: loadingCoupons } = useGetCoupons();
  const { data: condicoesPagamento, isLoading: loadingCondPag } =
    useCondicaoPagamento();
  const [selectedCondPag, setSelectedCondPag] = useState<string>("none");
  const { data, mutate } = useCustomers(1, 1, cpfCnpj);
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
    const limitedNumbers = numbers.slice(0, 9);

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

  // Função para formatar CPF/CNPJ
  function formatCpfCnpj(value: string): string {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");

    // Limita a 14 dígitos (CNPJ)
    const limitedNumbers = numbers.slice(0, 14);

    // Aplica a máscara baseada no tamanho
    // if (limitedNumbers.length <= 11) {
    // Formato CPF: 000.000.000-00
    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3)}`;
    } else if (limitedNumbers.length <= 9) {
      return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3, 6)}.${limitedNumbers.slice(6)}`;
    } else {
      return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3, 6)}.${limitedNumbers.slice(6, 9)}-${limitedNumbers.slice(9)}`;
    }
    // }
    // } else {
    //   // Formato CNPJ: 00.000.000/0000-00
    //   if (limitedNumbers.length <= 2) {
    //     return limitedNumbers;
    //   } else if (limitedNumbers.length <= 5) {
    //     return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2)}`;
    //   } else if (limitedNumbers.length <= 8) {
    //     return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2, 5)}.${limitedNumbers.slice(5)}`;
    //   } else if (limitedNumbers.length <= 12) {
    //     return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2, 5)}.${limitedNumbers.slice(5, 8)}/${limitedNumbers.slice(8)}`;
    //   } else {
    //     return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2, 5)}.${limitedNumbers.slice(5, 8)}/${limitedNumbers.slice(8, 12)}-${limitedNumbers.slice(12)}`;
    //   }
    // }
  }

  // Função para remover a máscara do CPF/CNPJ
  function removeCpfCnpjMask(value: string): string {
    return value.replace(/\D/g, "");
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchUserId = async () => {
      setIdUser(user?.id_user || "");
    };
    fetchUserId();
  }, [user]);

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
    if (selectedCoupon && selectedCoupon !== "none") {
      const coupon = coupons.find((c: any) => c.id_coupons === selectedCoupon);
      if (coupon) {
        finalPrice = total - total * (Number(coupon.discount) / 100);
      }
    }

    setPrice(finalPrice);
  }, [services, selectedCoupon, coupons]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateOrderLoading(true);
    if (!idUser) {
      setCreateOrderLoading(false);
      toast.error(
        "Aguardando carregamento do usuário. Por favor, tente novamente em instantes.",
      );
      return;
    }

    if (cpfCnpj.length !== 11) {
      setCreateOrderLoading(false);
      toast.error("CPF/CNPJ inválido");
      return;
    }

    if (!email || email.length === 0) {
      setCreateOrderLoading(false);
      toast.error("Informe um email válido");
      return;
    }

    if (!name || name.length === 0) {
      setCreateOrderLoading(false);
      toast.error("Informe um nome válido");
      return;
    }

    if (!phone || phone.length !== 9) {
      setCreateOrderLoading(false);
      toast.error("Informe um telefone válido");
      return;
    }

    if (selectedCondPag === "none") {
      setCreateOrderLoading(false);
      toast.error("Selecione uma condição de pagamento.");
      return;
    }

    for (const service of services) {
      if (service.id_service === undefined) {
        setCreateOrderLoading(false);
        toast.error("Verifique a lista de serviços.");
        return;
      }
      if (
        service.price === undefined ||
        service.price === null ||
        service.price === ""
      ) {
        setCreateOrderLoading(false);
        toast.error("Verifique os preços dos serviços.");
        return;
      }
      if (
        service.quantity === undefined ||
        service.quantity === null ||
        service.quantity === 0
      ) {
        setCreateOrderLoading(false);
        toast.error("Verifique as quantidades dos serviços.");
        return;
      }
      if (
        service.suggestedDate === undefined ||
        service.suggestedDate === null ||
        service.suggestedDate === ""
      ) {
        setCreateOrderLoading(false);
        toast.error("Verifique as datas dos serviços.");
        return;
      }
      if (
        service.time === undefined ||
        service.time === null ||
        service.time.length === 0 ||
        service.time.length > 1
      ) {
        setCreateOrderLoading(false);
        toast.error("Verifique os horários dos serviços.");
        return;
      }
    }

    const newOrder: OrderInputValues = {
      id_user: idUser,
      pre_name: name,
      pre_email: email,
      pre_cpf_cnpj: cpfCnpj || undefined,
      pre_ddi: ddi,
      pre_ddd: ddd,
      pre_phone: phone,
      id_customer: id_customer,
      price: price.toString().replace(".", ","),
      id_cond_pag:
        selectedCondPag && selectedCondPag !== "none" ? selectedCondPag : null,
      id_coupons:
        selectedCoupon && selectedCoupon !== "none" ? selectedCoupon : null,
      services: services
        .filter((service) => service.id_service !== undefined)
        .map((service) => ({
          id_service: service.id_service!,
          price: service.price?.toString() || "0",
          quantity: service.quantity ?? 1,
          discount: service.discount ?? 0,
          suggested_date: service.suggestedDate
            ? new Date(service.suggestedDate + "T00:00:00.000Z").toISOString()
            : undefined,
          time:
            service.time && service.time.length > 0
              ? JSON.stringify(service.time)
              : undefined,
        })),
    };

    const response = await createOrder(newOrder);
    if (response.status === 201) {
      setCreateOrderLoading(false);
      router.push("/orders");
    } else {
      setCreateOrderLoading(false);
    }
  };

  async function verifyClient(cpfCnpj: string) {
    setLoadingUser(true);
    mutate();
    if (data?.customers.length === 1) {
      setName(data.customers[0].nome || "");
      setEmail(data.customers[0].email || "");
      setCpfCnpj(data.customers[0].cpf_cnpj || cpfCnpj);
      setDdi(data.customers[0].ddi || "");
      setDdd(data.customers[0].ddd || "");
      setPhone(removePhoneMask(data.customers[0].telefone || ""));
      setIdCustomer(data.customers[0].id_customer || "");
      setIsClientNotFound(false);
      setLoadingUser(false);
      return;
    }

    setIsClientNotFound(true);
    setLoadingUser(false);
    return;
  }

  if (loading) {
    return (
      <main className="min-h-screen p-4 bg-sky-100 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </main>
    );
  }
  if (!user) {
    return null;
  }

  return (
    <div className=" p-4 min-h-screen bg-sky-100 sm:ml-17 sm:-mt-11">
      <Sidebar />
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Novo Orçamento</h1>
        <Link href="/orders" title="Voltar">
          <Button className="cursor-pointer">
            <ArrowLeft />
          </Button>
        </Link>
      </div>

      <div className="bg-white p-4 rounded shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-wrap">
          <div className="flex flex-wrap w-full">
            <div className="w-full sm:w-1/2 p-2">
              <label className="font-semibold flex items-center">
                CPF:
                {loadingUser ? (
                  <span className="ml-2 text-red-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </span>
                ) : (
                  <>
                    <span className="ml-2">
                      {isClientNotFound ? "Cliente não cadastrado" : ""}
                    </span>
                  </>
                )}
              </label>
              <Input
                type="text"
                value={formatCpfCnpj(cpfCnpj)}
                onChange={(e) => setCpfCnpj(removeCpfCnpjMask(e.target.value))}
                onBlur={() => verifyClient(cpfCnpj)}
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>
            <div className="w-full sm:w-1/2 p-2">
              <label className="font-semibold">Email:</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-1/2 p-2">
              <label className="font-semibold">Nome:</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-1/2 sm:w-1/8 p-2">
              <label className="font-semibold">DDI:</label>
              <Input
                type="text"
                value={ddi}
                onChange={(e) => setDdi(e.target.value)}
              />
            </div>
            <div className="w-1/2 sm:w-1/8 p-2">
              <label className="font-semibold">DDD:</label>
              <Input
                type="text"
                value={ddd}
                onChange={(e) => setDdd(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-1/4 p-2">
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
            <div className="w-full sm:w-1/3 p-2">
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
                    coupons.map((coupon: any) => (
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
            <div className="w-full sm:w-1/3 p-2">
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
            <div className="w-full sm:w-1/3 p-2">
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
            <Button type="submit" className="cursor-pointer">
              {createOrderLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Criar"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
