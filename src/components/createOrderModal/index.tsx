"use client";

import { useState, useEffect, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateOrderPayload } from "@/app/hooks/orders/useCreateOrders";
import { ServicesSelector, ServiceSelection } from "../servicesSelection";
import { getUserClient } from "@/lib/cookieClient";

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateOrderPayload) => Promise<void> | void;
}

export function CreateOrderModal({
  isOpen,
  onClose,
  onCreate,
}: CreateOrderModalProps) {
  const [idUser, setIdUser] = useState<string>("");
  const [price, setPrice] = useState(0);

  // Estado para os serviços selecionados pelo componente ServicesSelector
  const [services, setServices] = useState<ServiceSelection[]>([]);
  // Outros estados para inputs de cliente, se necessário
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [ddi, setDdi] = useState<string>("");
  const [ddd, setDdd] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserClient();
      setIdUser(userId || "");
      setLoadingUser(false);
    };

    fetchUserId();
  }, []);

  // Atualiza o preço total considerando o desconto: para cada serviço, o total é (price - discount)
  useEffect(() => {
    const total = services.reduce(
      (acc, service) =>
        acc + ((Number(service.price) || 0) - (Number(service.discount) || 0)),
      0
    );
    setPrice(total);
  }, [services]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loadingUser || !idUser) {
      alert(
        "Aguardando carregamento do usuário. Por favor, tente novamente em instantes."
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
      price: price,
      services: services
        .filter((service) => service.id_service !== undefined)
        .map((service) => ({
          id_service: service.id_service!, // Força que seja number (já que filtramos os indefinidos)
          price: service.price,
          discount: service.discount ?? 0,
          suggested_date: service.suggestedDate
            ? new Date(service.suggestedDate).toISOString()
            : undefined,
        })),
    };
    console.log("new order:", newOrder);
    await onCreate(newOrder);
    onClose();

    setPrice(0);
    setServices([]);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-4 m-5 rounded shadow-md w-4xl">
        <h3 className="text-lg font-bold mb-2">Criar Novo Orçamento</h3>
        <form onSubmit={handleSubmit} className="flex flex-wrap">
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
            <Input
              type="text"
              value={ddi}
              onChange={(e) => setDdi(e.target.value)}
            />
          </div>
          <div className="w-1/4 p-2">
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="w-1/4 p-2">
            <label className="font-semibold">Preço Total:</label>
            <Input type="number" value={price} readOnly />
          </div>

          {/* Componente para seleção de serviços */}
          <div className="w-full p-2">
            <ServicesSelector onChange={setServices} />
          </div>

          <div className="flex justify-end gap-2 mt-4 w-full">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Criar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
