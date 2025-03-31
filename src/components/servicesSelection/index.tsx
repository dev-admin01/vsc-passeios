"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Services } from "@/types/service.types";
import { useSelectServices } from "@/app/hooks/service/useSelectServices";

// Atualize a interface para incluir discount
export interface ServiceSelection {
  id_service?: number;
  price?: number;
  discount?: number; // novo campo para desconto
  suggestedDate?: string;
}

interface ServicesSelectorProps {
  onChange: (services: ServiceSelection[]) => void;
}

export function ServicesSelector({ onChange }: ServicesSelectorProps) {
  const [availableServices, setAvailableServices] = useState<Services[]>([]);
  const [selectedServices, setSelectedServices] = useState<ServiceSelection[]>([
    {
      id_service: undefined,
      price: undefined,
      discount: 0,
      suggestedDate: "",
    },
  ]);

  const { selectServices } = useSelectServices();

  useEffect(() => {
    async function fetchServices() {
      const services = await selectServices();
      setAvailableServices(services);
    }
    fetchServices();
  }, [selectServices]);

  // Propaga alterações para o componente pai
  useEffect(() => {
    onChange(selectedServices);
  }, [selectedServices, onChange]);

  const handleChange = (
    index: number,
    field: keyof ServiceSelection,
    value: any
  ) => {
    const updated = [...selectedServices];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedServices(updated);
  };

  const handleServiceSelect = (index: number, value: string) => {
    const serviceId = Number(value);
    const selectedService = availableServices.find(
      (s) => s.id_service === serviceId
    );
    const price = selectedService ? Number(selectedService.price) : undefined;
    // Atualiza a linha com o serviceId e o preço automaticamente
    const updated = {
      ...selectedServices[index],
      id_service: serviceId,
      price: price,
    };
    const newSelectedServices = [...selectedServices];
    newSelectedServices[index] = updated;
    setSelectedServices(newSelectedServices);
  };

  const addServiceRow = () => {
    setSelectedServices([
      ...selectedServices,
      {
        id_service: undefined,
        price: undefined,
        discount: 0,
        suggestedDate: "",
      },
    ]);
  };

  const removeServiceRow = (index: number) => {
    const updated = [...selectedServices];
    updated.splice(index, 1);
    setSelectedServices(updated);
  };

  return (
    <div className="space-y-4">
      {selectedServices.map((service, index) => (
        <div key={index} className="flex gap-2 items-center">
          <div>
            <label className="font-semibold">Serviços:</label>
            <select
              className="border p-2 rounded w-full"
              value={service.id_service || ""}
              onChange={(e) => handleServiceSelect(index, e.target.value)}
            >
              <option value="">Selecione um serviço</option>
              {availableServices.map((s) => (
                <option key={s.id_service} value={s.id_service}>
                  {s.description}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-semibold">Preço (R$):</label>
            <Input
              type="number"
              value={service.price !== undefined ? service.price : ""}
              onChange={(e) =>
                handleChange(index, "price", Number(e.target.value))
              }
            />
          </div>
          <div>
            <label className="font-semibold">Desconto (R$)</label>
            <Input
              type="number"
              value={service.discount !== undefined ? service.discount : ""}
              onChange={(e) =>
                handleChange(index, "discount", Number(e.target.value))
              }
            />
          </div>
          <div>
            <label className="font-semibold">Data sugerida</label>
            <Input
              type="datetime-local"
              placeholder="Data sugerida"
              value={service.suggestedDate || ""}
              onChange={(e) =>
                handleChange(index, "suggestedDate", e.target.value)
              }
            />
          </div>
          <div className="pt-6">
            <Button
              type="button"
              variant="destructive"
              onClick={() => removeServiceRow(index)}
            >
              Remover
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" onClick={addServiceRow}>
        Adicionar Serviço
      </Button>
    </div>
  );
}
