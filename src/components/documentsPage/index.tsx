/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { useSingleOrder } from "@/app/hooks/orders/useGetUpdateOrder";
import { useDocsCostumer } from "@/app/hooks/costumer/useDocsCostumer";
import { Input } from "@/components/ui/input";

interface ClientOrderDocumentationProps {
  id: string;
}

export default function ClientOrderDocumentation({
  id,
}: ClientOrderDocumentationProps) {
  const { data, error, isLoading } = useSingleOrder(id);
  const {
    trigger: saveDocs,
    isMutating: isSaving,
    error: errorSaving,
    dataDocs,
  } = useDocsCostumer();

  const [idOrder, setIdOrder] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [preName, setPreName] = useState("");
  const [preEmail, setPreEmail] = useState("");
  const [preDdi, setPreDdi] = useState("");
  const [preDdd, setPreDdd] = useState("");
  const [prePhone, setPrePhone] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [idCostumer, setIdCostumer] = useState("");
  const [costumer, setCostumer] = useState([]);
  const [services, setServices] = useState([]);
  const [needCNH, setNeedCNH] = useState(false);

  // Campos que serão salvos no banco
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [passaport, setPassaporte] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ddi, setDdi] = useState("");
  const [ddd, setDdd] = useState("");
  const [phone, setPhone] = useState("");

  // Campos base64
  const [compPag, setCompPag] = useState<string>("");
  const [cnh, setCnh] = useState<string>("");

  // Estados para a autorização visual
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [typedOrderNumber, setTypedOrderNumber] = useState("");
  const [authError, setAuthError] = useState("");

  // Ao selecionar arquivos, geramos o base64
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<string>>
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
  console.log(costumer);

  // Atualiza os estados com os dados carregados
  useEffect(() => {
    if (data?.order) {
      const o = data.order;
      setIdOrder(o.id_order);
      setOrderNumber(o.order_number);
      setPreName(o.pre_name ?? "");
      setPreEmail(o.pre_email ?? "");
      setPreDdi(o.pre_ddi ?? "");
      setPreDdd(o.pre_ddd ?? "");
      setPrePhone(o.pre_phone ?? "");
      setPrice(Number(o.price) || 0);
      setIdCostumer(o.id_costumer || "");
      setCostumer(o.costumer);

      if (o.orders_service) {
        const mapped = o.orders_service.map((srv: any) => ({
          id_order_service: srv.id_order_service,
          id_service: srv.id_service,
          price: Number(srv.price) || 0,
          discount: Number(srv.discount) || 0,
          suggestedDate: srv.suggested_date,
          description: srv.service.description,
          type: srv.service.type,
          observation: srv.service.observation,
        }));
        setServices(mapped);
      } else {
        setServices([]);
      }
    }
  }, [data]);

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
    const payload = {
      id_order: idOrder,
      cpf_cnpj: cpfCnpj,
      passaport: passaport,
      name,
      email,
      ddi,
      ddd,
      phone,
      compPag,
      cnh,
    };

    await saveDocs(payload);
    console.log(dataDocs);
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar a ordem.</div>;

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
        <div>{idOrder}</div>
      ) : (
        <main className="flex flex-wrap p-4 w-screen">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full">
            <h2 className="text-xl font-bold mb-4">Pré-cadastro do cliente</h2>
            <div className="space-y-2 flex w-full">
              <div className="me-6">
                <span className="font-semibold">Nome:</span> {preName}
              </div>
              <div className="me-6">
                <span className="font-semibold">Email:</span> {preEmail}
              </div>
              <div className="me-6">
                <span className="font-semibold">Telefone:</span>{" "}
                {preDdi && `+${preDdi} `}
                {preDdd && `(${preDdd}) `}
                {prePhone}
              </div>
              <div className="me-6">
                <span className="font-semibold">Preço:</span>{" "}
                {Number(price).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 w-full mt-4">
            <h2 className="text-xl font-bold mb-4">Cadastro do cliente</h2>
            <div className="space-y-2 flex flex-wrap w-full">
              <div className="w-1/2 p-2">
                <label className="font-semibold">CPF / CNPJ:</label>
                <Input
                  type="text"
                  value={cpfCnpj}
                  onChange={(e) => setCpfCnpj(e.target.value)}
                />
              </div>
              <div className="w-1/2 p-2">
                <label className="font-semibold">Passaporte:</label>
                <Input
                  type="text"
                  value={passaport}
                  onChange={(e) => setPassaporte(e.target.value)}
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
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {isSaving ? "Enviando..." : "Salvar Documentos"}
              </button>
              {errorSaving && (
                <p className="text-red-500 mt-2">
                  Erro ao enviar documentos: {String(errorSaving)}
                </p>
              )}
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
                      Preço:{" "}
                      {Number(service.price).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                    <p>
                      Desconto:{" "}
                      {Number(service.discount).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                    <p>
                      Data Sugerida:{" "}
                      {new Date(service.suggestedDate).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
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
