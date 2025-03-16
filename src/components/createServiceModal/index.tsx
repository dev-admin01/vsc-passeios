"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Tipo usado na criação
export interface CreateServicePayload {
  description: string;
  type: string;
  price: string;
  observation: string;
}

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateServicePayload) => Promise<void> | void;
}

export function CreateServiceModal({
  isOpen,
  onClose,
  onCreate,
}: CreateServiceModalProps) {
  const [description, setDescription] = useState("");
  const [type, setType] = useState("0");
  const [price, setPrice] = useState("");
  const [observation, setObservation] = useState("");

  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Monta o payload sem ID
    const payload: CreateServicePayload = {
      description,
      type,
      price,
      observation,
    };

    try {
      await onCreate(payload);
      // Fecha e limpa depois de criar
      onClose();
      setDescription("");
      setType("0");
      setPrice("");
      setObservation("");
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-4 rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-bold mb-2">Criar Novo Serviço</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div>
            <label className="font-semibold">Descrição:</label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="font-semibold">Tipo:</label>
            <Input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="font-semibold">Preço:</label>
            <Input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="font-semibold">Observação:</label>
            <Input
              type="text"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
