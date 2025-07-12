/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { useOrder } from "@/app/hooks/orders/useOrder";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ConvertCurrency } from "@/lib/shared/currencyConverter";

interface Service {
  id_order_service: number;
  id_service: number;
  price: string;
  discount: string;
  suggestedDate: string;
  time: string;
  description: string;
  type: string;
  observation: string;
}

interface Costumer {
  id_costumer: string;
  nome: string;
  email: string;
  cpf_cnpj: string;
  rg: string;
  razao_social: string | null;
  nome_fantasia: string | null;
  ddi: string;
  ddd: string;
  telefone: string;
  indicacao: string | null;
}

interface ClientOrderDocumentationProps {
  id: string;
  orderData: {
    order: {
      id_order: string;
      order_number: string;
      price: string;
      pre_name: string;
      pre_email: string;
      pre_ddi: string;
      pre_ddd: string;
      pre_phone: string;
      created_at: string;
      id_status_order: number;
      pre_cpf_cnpj: string;
      orders_service: Array<{
        id_order_service: number;
        id_service: number;
        discount: string;
        price: string;
        suggested_date: string;
        quantity: number;
        time: string;
        service: {
          description: string;
          observation: string;
          type: string;
        };
      }>;
      cond_pag: {
        description: string;
        installments: string;
        discount: string;
      };
      coupons?: {
        coupon: string;
        discount: string;
      };
      customer?: Costumer;
    };
    status_code: number;
  };
  initialOrderNumber: string;
}

// Função para formatar CPF
function formatCPF(value: string) {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");

  // Aplica a máscara de CPF (000.000.000-00)
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  } else if (numbers.length <= 9) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  } else {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  }
}

// Função para formatar RG
function formatRG(value: string) {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");

  // Aplica a máscara de RG (XX.XXX.XXX-X)
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 5) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  } else if (numbers.length <= 8) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
  } else {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}-${numbers.slice(8, 9)}`;
  }
}

export default function ClientOrderDocumentation({
  orderData,
  initialOrderNumber,
}: ClientOrderDocumentationProps) {
  const { orderDocumentation } = useOrder();
  const router = useRouter();
  const [idOrder, setIdOrder] = useState("");
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [preName, setPreName] = useState("");
  const [preEmail, setPreEmail] = useState("");
  const [preDdi, setPreDdi] = useState("");
  const [preDdd, setPreDdd] = useState("");
  const [prePhone, setPrePhone] = useState("");
  const [price, setPrice] = useState("");
  const [idCostumer, setIdCostumer] = useState("");
  const [costumer, setCostumer] = useState<Costumer | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [needCNH, setNeedCNH] = useState(false);

  // Campos que serão salvos no banco
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [rg, setRg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ddi, setDdi] = useState("");
  const [ddd, setDdd] = useState("");
  const [phone, setPhone] = useState("");
  const [hotel, setHotel] = useState<string>("");
  const [hotelCheckin, setHotelCheckin] = useState<string>("");
  const [hotelCheckout, setHotelCheckout] = useState<string>("");
  const [compPag, setCompPag] = useState<string>("");
  const [cnh, setCnh] = useState<string>("");

  // Estados para a autorização visual
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [typedOrderNumber, setTypedOrderNumber] = useState("");
  const [authError, setAuthError] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  console.log("orderData", orderData);

  // Ao selecionar arquivos, geramos o base64
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (!event.target?.result) return;
      const base64String = (event.target.result as string).split(",")[1];
      setValue(base64String);
    };
    reader.readAsDataURL(file);
  };

  // Atualiza os estados com os dados carregados
  useEffect(() => {
    if (orderData?.order) {
      const o = orderData.order;
      setIdOrder(o.id_order);
      setCpfCnpj(o.pre_cpf_cnpj || "");
      setOrderNumber(o.order_number);
      setPreName(o.pre_name ?? "");
      setPreEmail(o.pre_email ?? "");
      setPreDdi(o.pre_ddi ?? "");
      setPreDdd(o.pre_ddd ?? "");
      setPrePhone(o.pre_phone ?? "");
      setPrice(o.price || "");
      setIdCostumer(o.customer?.id_costumer || "");
      setCostumer(o.customer || null);

      // Carregando dados do cliente nos inputs
      if (o.customer) {
        setCpfCnpj(o.customer.cpf_cnpj || "");
        setRg(o.customer.rg || "");
        setName(o.customer.nome || "");
        setEmail(o.customer.email || "");
        setDdi(o.customer.ddi || "");
        setDdd(o.customer.ddd || "");
        setPhone(o.customer.telefone || "");
      } else {
        // Se não houver cliente, carrega os dados do pré-cadastro
        setCpfCnpj("");
        setRg("");
        setName(o.pre_name || "");
        setEmail(o.pre_email || "");
        setDdi(o.pre_ddi || "");
        setDdd(o.pre_ddd || "");
        setPhone(o.pre_phone || "");
        setPrice(o.price || "");
      }

      if (o.orders_service) {
        const mapped = o.orders_service.map((srv: any) => {
          return {
            id_order_service: srv.id_order_service,
            id_service: srv.id_service,
            price: srv.price,
            discount: srv.discount,
            suggestedDate: srv.suggested_date,
            time: srv.time || "",
            description: srv.service.description,
            type: srv.service.type,
            observation: srv.service.observation,
          };
        });
        setServices(mapped);
      } else {
        setServices([]);
      }
    }
  }, [orderData]);

  // Verifica se precisa de CNH
  useEffect(() => {
    services.forEach((service: any) => {
      if (service.type === "1") {
        setNeedCNH(true);
      }
    });
  }, [services]);

  // Função para verificar se o orderNumber digitado está correto
  const handleAuthorize = () => {
    if (typedOrderNumber === orderNumber) {
      setIsAuthorized(true);
      setAuthError("");
    } else {
      setAuthError("Número do pedido incorreto. Tente novamente.");
    }
  };

  const handleSendDocs = async () => {
    try {
      setIsSaving(true);
      const payload = {
        id_order: idOrder,
        cpf_cnpj: cpfCnpj,
        rg,
        name,
        email,
        ddi,
        ddd,
        phone: phone.replace(/\D/g, ""),
        hotel,
        hotelCheckin: new Date(hotelCheckin + "T00:00:00.000Z").toISOString(),
        hotelCheckout: new Date(hotelCheckout + "T00:00:00.000Z").toISOString(),
        compPag,
        cnh,
      };

      const response = await orderDocumentation(payload);

      if (response.status === 200) {
        router.refresh();
        setIsSaving(false);
      }
    } catch (error) {
      console.error("Erro ao enviar documentos:", error);
      setIsSaving(false);
    }
  };

  if (orderData === null) return <div>Carregando...</div>;
  if (orderData?.status_code !== 200)
    return <div>Erro ao carregar a ordem.</div>;

  // Se não estiver autorizado, exibe apenas o formulário para digitar o orderNumber
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-sky-100 flex items-center justify-center">
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-xl font-bold mb-4">
            Digite o número do pedido para acessar a página
          </h2>
          <Input
            type="text"
            value={typedOrderNumber}
            onChange={(e) => setTypedOrderNumber(e.target.value)}
            placeholder="Ex: 123456"
            className="mb-4"
          />
          <button
            onClick={handleAuthorize}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Confirmar
          </button>
          {authError && <p className="text-red-500 mt-2">{authError}</p>}
        </div>
      </div>
    );
  }

  // Se autorizado, exibe o conteúdo completo
  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
      <header className="bg-white shadow p-4 flex items-center justify-between">
        <img src="/logo.png" alt="Logo" className="h-20 w-auto" />
        <h1 className="text-5xl">
          Orçamento: <span className="font-bold">{orderNumber}</span>
        </h1>
      </header>

      {idCostumer ? (
        <div>
          <div>{idOrder}</div>
          <div>{costumer?.nome}</div>
        </div>
      ) : (
        <main className="flex flex-wrap p-4 w-screen">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full">
            <h2 className="text-xl font-bold mb-4">Pré-cadastro do cliente</h2>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 w-full">
              <div>
                <span className="font-semibold">Nome:</span> {preName}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {preEmail}
              </div>
              <div>
                <span className="font-semibold">Telefone:</span>{" "}
                {preDdi && `+${preDdi} `}
                {preDdd && `(${preDdd}) `}
                {prePhone}
              </div>
              <div className="flex flex-row justify-between">
                {orderData.order.coupons && (
                  <div className="me-4">
                    <span className="font-semibold">Cupom aplicado:</span>{" "}
                    {orderData.order.coupons.coupon} -{" "}
                    {orderData.order.coupons.discount}%
                  </div>
                )}
                <div>
                  <span className="font-semibold me-2">Preço: </span> R${" "}
                  {ConvertCurrency.formatCurrency(price)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 w-full mt-4">
            <h2 className="text-xl font-bold mb-4">Cadastro do cliente</h2>
            <div className="space-y-2 flex flex-wrap w-full">
              <div className="w-1/2 p-2">
                <label className="font-semibold">CPF:</label>
                <Input
                  type="text"
                  value={cpfCnpj}
                  onChange={(e) => {
                    const formattedValue = formatCPF(e.target.value);
                    setCpfCnpj(formattedValue);
                  }}
                  maxLength={14}
                  placeholder="000.000.000-00"
                />
              </div>
              <div className="w-1/2 p-2">
                <label className="font-semibold">RG:</label>
                <Input
                  type="text"
                  value={rg}
                  onChange={(e) => {
                    const formattedValue = formatRG(e.target.value);
                    setRg(formattedValue);
                  }}
                  maxLength={12}
                  placeholder="00.000.000-0"
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
              <div className="w-1/2 p-2">
                <label className="font-semibold">Email:</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="w-1/4 p-2">
                <label className="font-semibold">DDI:</label>
                <Input value={ddi} onChange={(e) => setDdi(e.target.value)} />
              </div>
              <div className="w-1/4 p-2">
                <label className="font-semibold">DDD:</label>
                <Input value={ddd} onChange={(e) => setDdd(e.target.value)} />
              </div>
              <div className="w-1/4 p-2">
                <label className="font-semibold">Telefone:</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="w-1/2 p-2">
                <label className="font-semibold">Hotel:</label>
                <Input
                  value={hotel}
                  onChange={(e) => setHotel(e.target.value)}
                />
              </div>
              <div className="w-1/4 p-2">
                <label className="font-semibold">Check-in:</label>
                <Input
                  type="date"
                  value={hotelCheckin || ""}
                  onChange={(e) => setHotelCheckin(e.target.value)}
                />
              </div>
              <div className="w-1/4 p-2">
                <label className="font-semibold">Check-out:</label>
                <Input
                  type="date"
                  value={hotelCheckout || ""}
                  onChange={(e) => setHotelCheckout(e.target.value)}
                />
              </div>

              {/* Comprovante de pagamento */}
              <div className="w-1/2 p-2">
                <label className="font-semibold">
                  Comprovante de pagamento:
                </label>
                <Input
                  type="file"
                  onChange={(e) => handleFileChange(e, setCompPag)}
                />
              </div>

              {/* CNH (somente se precisar) */}
              {needCNH && (
                <div className="w-1/2 p-2">
                  <label className="font-semibold">CNH:</label>
                  <Input
                    type="file"
                    onChange={(e) => handleFileChange(e, setCnh)}
                  />
                </div>
              )}
            </div>

            <div className="w-full mt-4">
              <button
                onClick={handleSendDocs}
                disabled={isSaving}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Salvar Documentos"
                )}
              </button>
            </div>
          </div>

          {services && services.length > 0 && (
            <div className="bg-white shadow-lg rounded-lg p-6 w-full mt-4">
              <h2 className="text-xl font-bold mb-4">Passeios:</h2>
              <div className="space-y-2 flex flex-wrap w-full">
                {services.map((service: any) => (
                  <div
                    key={service.id_order_service}
                    className="bg-gray-100 p-4 m-2 rounded flex flex-col"
                  >
                    <h3 className="font-bold text-xl">
                      {service.description || "Serviço"}
                    </h3>
                    {service.type === "1" && (
                      <p className="text-red-500">Necessário CNH</p>
                    )}
                    <p>
                      Preço: R$ {ConvertCurrency.formatCurrency(service.price)}
                    </p>
                    <p>
                      Data Sugerida:{" "}
                      {new Date(service.suggestedDate).toLocaleDateString(
                        "pt-BR",
                      )}
                    </p>
                    {service.time && (
                      <p>Horário: {service.time.replace(/["\[\]]/g, "")}</p>
                    )}
                    <p>{service.observation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
