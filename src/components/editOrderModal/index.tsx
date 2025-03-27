// components/editOrderModal.tsx
"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Hook que obtem os detalhes de uma ordem, incluindo orders_service
import { useSingleOrder } from "@/app/hooks/orders/useGetUpdateOrder";

import { getUserClient } from "@/lib/cookieClient";

import {
  UpdateServiceSelection,
  UpdateServicesSelector,
} from "../updateServiceSelection";
import { UpdateOrderPayload } from "@/app/hooks/orders/useUpdateOrder";

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;
  onSave: (payload: UpdateOrderPayload) => void;
}

export function EditOrderModal({
  isOpen,
  onClose,
  orderId,
  onSave,
}: EditOrderModalProps) {
  // Busca a ordem completa (com SWR cache). Se `orderId` for null, não faz fetch.
  const { data, error, isLoading } = useSingleOrder(orderId);

  // Campos básicos da ordem
  const [idOrder, setIdOrder] = useState("");
  const [idUser, setIdUser] = useState("");
  const [preName, setPreName] = useState("");
  const [preEmail, setPreEmail] = useState("");
  const [preDdi, setPreDdi] = useState("");
  const [preDdd, setPreDdd] = useState("");
  const [prePhone, setPrePhone] = useState("");
  const [price, setPrice] = useState<number>(0);

  // Lista de serviços “selecionados” para essa ordem
  const [services, setServices] = useState<UpdateServiceSelection[]>([]);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserClient();
      setIdUser(userId || "");
    };

    fetchUserId();
  }, []);

  // Preenche os estados quando os dados chegarem (apenas se modal estiver aberto)
  useEffect(() => {
    if (isOpen && data?.order) {
      const o = data.order;
      setIdOrder(o.id_order);
      setPreName(o.pre_name ?? "");
      setPreEmail(o.pre_email ?? "");
      setPreDdi(o.pre_ddi ?? "");
      setPreDdd(o.pre_ddd ?? "");
      setPrePhone(o.pre_phone ?? "");
      setPrice(Number(o.price) || 0);

      if (o.orders_service) {
        const mapped = o.orders_service.map((srv: any) => ({
          id_order_service: srv.id_order_service,
          id_service: srv.id_service,
          price: Number(srv.price) || 0,
          discount: Number(srv.discount) || 0,
          suggestedDate: srv.suggested_date,
        }));
        setServices(mapped);
      } else {
        setServices([]);
      }
    }
  }, [isOpen, data]);

  // (Opcional) Limpa o estado quando o modal fecha, se quiser garantir que
  // uma próxima abertura não herde dados anteriores
  useEffect(() => {
    if (!isOpen) {
      setIdOrder("");
      setPreName("");
      setPreEmail("");
      setPreDdi("");
      setPreDdd("");
      setPrePhone("");
      setPrice(0);
      setServices([]);
    }
  }, [isOpen]);

  // Recalcula preço total ao mudar `services` (soma de price - discount)
  useEffect(() => {
    const total = services.reduce((acc, cur) => {
      const p = Number(cur.price) || 0;
      const d = Number(cur.discount) || 0;
      return acc + (p - d);
    }, 0);
    setPrice(total);
  }, [services]);

  // Se modal fechado, não renderiza nada
  if (!isOpen) {
    return null;
  }

  // Se estiver carregando...
  if (isLoading) {
    return (
      <ModalWrapper>
        <div className="bg-white p-6 rounded shadow-lg">
          Carregando orçamento..
        </div>
      </ModalWrapper>
    );
  }

  // Se houve erro no fetch
  if (error) {
    return (
      <ModalWrapper>
        <div className="bg-white p-6 rounded shadow-lg">
          Erro ao carregar orçamento
        </div>
      </ModalWrapper>
    );
  }

  // Ao clicar em "Salvar"
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Monta payload a ser enviado pro backend (update)
    const payload: UpdateOrderPayload = {
      id_order: idOrder,
      id_user: idUser,
      id_costumer: null,
      pre_name: preName,
      pre_email: preEmail,
      pre_ddi: preDdi,
      pre_ddd: preDdd,
      pre_phone: prePhone,
      price,
      services: services.map((srv) => ({
        id_order_service: srv.id_order_service,
        id_service: srv.id_service!,
        price: srv.price || 0,
        discount: srv.discount || 0,
        suggested_date: srv.suggested_date
          ? new Date(srv.suggested_date).toISOString()
          : undefined,
      })),
    };

    await onSave(payload);
    onClose(); // Fecha modal
  }

  return (
    <ModalWrapper>
      <div className="bg-white p-4 m-5 rounded shadow-md w-full max-w-3xl">
        <h3 className="text-lg font-bold mb-2">Editar Ordem</h3>

        <form onSubmit={handleSubmit} className="flex flex-wrap">
          {/* Dados básicos */}
          <div className="w-1/2 p-2">
            <label className="font-semibold">Nome:</label>
            <Input
              type="text"
              value={preName}
              onChange={(e) => setPreName(e.target.value)}
            />
          </div>
          <div className="w-1/2 p-2">
            <label className="font-semibold">Email:</label>
            <Input
              type="email"
              value={preEmail}
              onChange={(e) => setPreEmail(e.target.value)}
            />
          </div>
          <div className="w-1/4 p-2">
            <label className="font-semibold">DDI:</label>
            <Input value={preDdi} onChange={(e) => setPreDdi(e.target.value)} />
          </div>
          <div className="w-1/4 p-2">
            <label className="font-semibold">DDD:</label>
            <Input value={preDdd} onChange={(e) => setPreDdd(e.target.value)} />
          </div>
          <div className="w-1/4 p-2">
            <label className="font-semibold">Telefone:</label>
            <Input
              value={prePhone}
              onChange={(e) => setPrePhone(e.target.value)}
            />
          </div>
          <div className="w-1/4 p-2">
            <label className="font-semibold">Preço Total:</label>
            <Input type="number" value={price} readOnly />
          </div>

          {/* Selector de serviços */}
          <div className="w-full p-2">
            <label className="font-semibold">Serviços:</label>
            <UpdateServicesSelector
              initialServices={services}
              onChange={setServices}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-2 mt-4 w-full">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
}

// Componente auxiliar só para a sobreposição
function ModalWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      {children}
    </div>
  );
}
