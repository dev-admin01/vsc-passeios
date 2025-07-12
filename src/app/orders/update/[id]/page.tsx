"use client";

import { useAuthContext } from "@/app/contexts/authContext";
import { useState, useEffect } from "react";
import { use } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OrderUpdateValues } from "@/models/order";
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
import { useCustomer } from "@/app/hooks/costumer/useCostumer";

export default function UpdateOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { useCustomers } = useCustomer();
  const orderId = resolvedParams.id;
  const { user, loading } = useAuthContext();
  const [idUser, setIdUser] = useState<string>("");
  const [price, setPrice] = useState(0);
  const [services, setServices] = useState<ServiceSelection[]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [cpfCnpj, setCpfCnpj] = useState<string>("");
  const [ddi, setDdi] = useState<string>("");
  const [ddd, setDdd] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [selectedCoupon, setSelectedCoupon] = useState<string>("none");
  const [selectedCondPag, setSelectedCondPag] = useState<string>("none");
  const [updateOrderLoading, setUpdateOrderLoading] = useState(false);
  const [originalCouponId, setOriginalCouponId] = useState<string | null>(null);
  const [originalCondPagId, setOriginalCondPagId] = useState<string | null>(
    null,
  );
  const { getOrder, updateOrder } = useOrder();
  const { coupons, loading: loadingCoupons } = useGetCoupons();
  const { data: condicoesPagamento, isLoading: loadingCondPag } =
    useCondicaoPagamento();
  const router = useRouter();
  const [loadingUser, setLoadingUser] = useState(false);
  const [isClientNotFound, setIsClientNotFound] = useState(false);
  const [idCustomer, setIdCustomer] = useState<string>("");

  const { data, mutate } = useCustomers(1, 1, cpfCnpj);

  function formatCurrency(value: number): string {
    const valueInCents = Math.round(value * 100);
    let formattedValue = valueInCents.toString();
    formattedValue = formattedValue.padStart(3, "0");
    const reais = formattedValue.slice(0, -2);
    const centavos = formattedValue.slice(-2);
    const reaisFormatados = reais.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${reaisFormatados},${centavos}`;
  }
  // Função para formatar telefone
  function formatPhone(value: string): string {
    const numbers = value.replace(/\D/g, "");
    const limitedNumbers = numbers.slice(0, 9);
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
    const numbers = value.replace(/\D/g, "");
    const limitedNumbers = numbers.slice(0, 14);

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
  }

  // Função para remover a máscara do CPF/CNPJ
  function removeCpfCnpjMask(value: string): string {
    return value.replace(/\D/g, "");
  }

  // Carregar dados do usuário
  useEffect(() => {
    const fetchUserId = async () => {
      setIdUser(user?.id_user || "");
    };
    fetchUserId();
  }, [user]);

  // Carregar dados do pedido
  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) return;

      try {
        const orderData = await getOrder(orderId);
        setName(orderData.pre_name || "");
        setEmail(orderData.pre_email || "");
        setCpfCnpj(orderData.pre_cpf_cnpj || "");
        setDdi(orderData.pre_ddi || "");
        setDdd(orderData.pre_ddd || "");
        setPhone(orderData.pre_phone || "");
        setIdCustomer(orderData.id_customer || "");

        // Armazenar IDs originais para sincronização posterior
        setOriginalCouponId(orderData.id_coupons || null);
        setOriginalCondPagId(orderData.id_cond_pag || null);

        // Converter preço de string para número
        const priceValue =
          typeof orderData.price === "string"
            ? parseFloat(orderData.price.replace(",", "."))
            : orderData.price || 0;
        setPrice(priceValue);

        // Mapear serviços
        const formattedServices =
          orderData.orders_service?.map((service: any) => ({
            id_service: service.id_service,
            price:
              typeof service.price === "string"
                ? parseFloat(service.price.replace(",", "."))
                : service.price || 0,
            quantity: service.quantity || 1,
            discount: service.discount || 0,
            suggestedDate: service.suggested_date
              ? new Date(service.suggested_date).toISOString().split("T")[0]
              : "",
            time: service.time ? JSON.parse(service.time) : [],
            description: service.service?.description || "",
          })) || [];
        setServices(formattedServices);
      } catch (error) {
        console.error("Erro ao carregar dados do pedido:", error);
        toast.error("Erro ao carregar dados do pedido");
      }
    };

    fetchOrderData();
  }, [orderId, getOrder]);

  // Sincronizar cupom selecionado quando os cupons são carregados
  useEffect(() => {
    if (!loadingCoupons && coupons.length > 0 && originalCouponId) {
      const couponExists = coupons.some(
        (c) => c.id_coupons === originalCouponId,
      );
      if (couponExists) {
        setSelectedCoupon(originalCouponId);
      } else {
        setSelectedCoupon("none");
      }
    } else if (originalCouponId === null) {
      setSelectedCoupon("none");
    }
  }, [loadingCoupons, coupons, originalCouponId]);

  // Sincronizar condição de pagamento quando as condições são carregadas
  useEffect(() => {
    if (
      !loadingCondPag &&
      condicoesPagamento?.condicoesPagamento &&
      originalCondPagId
    ) {
      const condPagExists = condicoesPagamento.condicoesPagamento.some(
        (c) => c.id_cond_pag.toString() === originalCondPagId,
      );
      if (condPagExists) {
        setSelectedCondPag(originalCondPagId);
      } else {
        setSelectedCondPag("none");
      }
    } else if (originalCondPagId === null) {
      setSelectedCondPag("none");
    }
  }, [loadingCondPag, condicoesPagamento, originalCondPagId]);

  // Recalcular preço total
  useEffect(() => {
    const total = services.reduce((acc, service) => {
      const price =
        typeof service.price === "string"
          ? Number(service.price.replace(",", "."))
          : Number(service.price) || 0;
      const discountPercent = Number(service.discount) || 0;
      const quantity = Number(service.quantity) || 1;

      const priceWithDiscount = price - price * (discountPercent / 100);
      return acc + priceWithDiscount * quantity;
    }, 0);

    let finalPrice = total;
    if (selectedCoupon && selectedCoupon !== "none") {
      const coupon = coupons.find((c) => c.id_coupons === selectedCoupon);
      if (coupon) {
        finalPrice = total - total * (Number(coupon.discount) / 100);
      }
    }

    setPrice(finalPrice);
  }, [services, selectedCoupon, coupons]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateOrderLoading(true);
    if (!idUser) {
      toast.error(
        "Aguardando carregamento do usuário. Por favor, tente novamente em instantes.",
      );
      return;
    }

    if (cpfCnpj.length !== 11) {
      setUpdateOrderLoading(false);
      toast.error("CPF/CNPJ inválido");
      return;
    }

    if (!email || email.length === 0) {
      setUpdateOrderLoading(false);
      toast.error("Informe um email válido");
      return;
    }

    if (!name || name.length === 0) {
      setUpdateOrderLoading(false);
      toast.error("Informe um nome válido");
      return;
    }

    if (!phone || phone.length !== 9) {
      setUpdateOrderLoading(false);
      toast.error("Informe um telefone válido");
      return;
    }

    if (selectedCondPag === "none") {
      setUpdateOrderLoading(false);
      toast.error("Selecione uma condição de pagamento.");
      return;
    }

    for (const service of services) {
      if (service.id_service === undefined) {
        setUpdateOrderLoading(false);
        toast.error("Verifique a lista de serviços.");
        return;
      }
      if (
        service.price === undefined ||
        service.price === null ||
        service.price === ""
      ) {
        setUpdateOrderLoading(false);
        toast.error("Verifique os preços dos serviços.");
        return;
      }
      if (
        service.quantity === undefined ||
        service.quantity === null ||
        service.quantity === 0
      ) {
        setUpdateOrderLoading(false);
        toast.error("Verifique as quantidades dos serviços.");
        return;
      }
      if (
        service.suggestedDate === undefined ||
        service.suggestedDate === null ||
        service.suggestedDate === ""
      ) {
        setUpdateOrderLoading(false);
        toast.error("Verifique as datas dos serviços.");
        return;
      }
      console.log("service", service.time);
      if (
        service.time === undefined ||
        service.time === null ||
        service.time.length === 0 ||
        service.time.length > 1
      ) {
        setUpdateOrderLoading(false);
        toast.error("Verifique os horários dos serviços.");
        return;
      }
    }

    const updatedOrder: OrderUpdateValues = {
      id_user: idUser,
      id_customer: idCustomer || null,
      pre_name: name,
      pre_email: email,
      pre_cpf_cnpj: cpfCnpj || undefined,
      pre_ddi: ddi,
      pre_ddd: ddd,
      pre_phone: phone,
      price: price.toString().replace(".", ","),
      id_cond_pag:
        selectedCondPag && selectedCondPag !== "none"
          ? selectedCondPag
          : undefined,
      id_coupons:
        selectedCoupon && selectedCoupon !== "none"
          ? selectedCoupon
          : undefined,
      services: services
        .filter((service) => service.id_service !== undefined)
        .map((service) => ({
          id_service: service.id_service!,
          price: service.price?.toString().replace(".", ",") || "0",
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
    console.log("updatedOrder", updatedOrder);
    const response = await updateOrder(orderId, updatedOrder);
    if (response) {
      router.push("/orders");
      setUpdateOrderLoading(false);
    } else {
      setUpdateOrderLoading(false);
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

    if (data?.customers.length === 0) {
      setName("");
      setEmail("");
      setDdi("");
      setDdd("");
      setPhone("");
      setIdCustomer("");
      setIsClientNotFound(true);
      setLoadingUser(false);
      return;
    }
  }

  if (loading) {
    return (
      <div className="p-4 min-h-screen bg-sky-100 flex justify-center items-center sm:ml-17 sm:-mt-11">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen bg-sky-100 sm:-mt-20">
      <Sidebar />
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Atualizar Orçamento</h1>
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
            <div className="w-1/2 p-2">
              <label className="font-semibold">Email:</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="w-1/2 p-2">
              <label className="font-semibold">Nome:</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                maxLength={11}
              />
            </div>
            <div className="w-1/2 p-2">
              <label className="font-semibold">Cupom:</label>
              <Select value={selectedCoupon} onValueChange={setSelectedCoupon}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um cupom (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum cupom</SelectItem>
                  {!loadingCoupons &&
                    coupons.map((coupon) => (
                      <SelectItem
                        key={coupon.id_coupons}
                        value={coupon.id_coupons}
                      >
                        {coupon.coupon} - {coupon.discount}% de desconto
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/2 p-2">
              <label className="font-semibold">Condição de Pagamento:</label>
              <Select
                value={selectedCondPag}
                onValueChange={setSelectedCondPag}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma condição (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma condição</SelectItem>
                  {!loadingCondPag &&
                    condicoesPagamento?.condicoesPagamento
                      ?.filter(
                        (cond) =>
                          cond.description !== "Pix" &&
                          cond.description !== "pix" &&
                          cond.description !== "PIX",
                      )
                      ?.map((cond) => (
                        <SelectItem
                          key={cond.id_cond_pag}
                          value={cond.id_cond_pag}
                        >
                          {cond.description} - {cond.installments} parcelas
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="w-full p-2">
            <ServicesSelector
              onChange={setServices}
              initialServices={services}
            />
          </div>

          <div className="w-full p-2 flex justify-between items-center">
            <div className="text-lg font-bold">
              Preço Total: R$ {formatCurrency(price)}
            </div>
            <Button
              type="submit"
              disabled={!idUser || loading}
              className="cursor-pointer"
            >
              {updateOrderLoading ? "Carregando..." : "Atualizar Orçamento"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
