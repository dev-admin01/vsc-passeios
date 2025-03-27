/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { useSingleOrder } from "@/app/hooks/orders/useGetUpdateOrder";

import { Input } from "@/components/ui/input";

interface ClientOrderDocumentationProps {
  id: string;
}

export default function ClientOrderDocumentation({
  id,
}: ClientOrderDocumentationProps) {
  // Hooks para armazenar os dados da ordem
  const { data, error, isLoading } = useSingleOrder(id);

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

  const [cpfCnpj, setCpfCnpj] = useState("");
  const [passaport, setPassaporte] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ddi, setDdi] = useState("");
  const [ddd, setDdd] = useState("");
  const [phone, setPhone] = useState("");
  const [compPag, setCompPag] = useState("");
  const [cnh, setCnh] = useState("");

  useEffect(() => {
    console.log(data);
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

  useEffect(() => {
    console.log("services:", services);
    services?.map((service: any) => {
      const type = service.type;
      if (type === "1") {
        setNeedCNH(true);
        return;
      }
    });
  }, [services]);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar a ordem.</div>;

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
          {costumer}
          {idOrder}
        </div>
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
            <h2 className="text-xl font-bold mb-4">cadastro do cliente</h2>
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
              <div className="w-1/2 p-2">
                <label className="font-semibold">
                  Comprovante de pagamento:
                </label>
                <Input
                  type="file"
                  value={compPag}
                  onChange={(e) => setCompPag(e.target.value)}
                />
              </div>
              {needCNH && (
                <div className="w-1/2 p-2">
                  <label className="font-semibold">CNH:</label>
                  <Input
                    type="file"
                    value={cnh}
                    onChange={(e) => setCnh(e.target.value)}
                  />
                </div>
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
