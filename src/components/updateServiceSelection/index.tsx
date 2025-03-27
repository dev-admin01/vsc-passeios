"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Services } from "@/types/service.types";
import { useSelectServices } from "@/app/hooks/service/useSelectServices";

export interface UpdateServiceSelection {
  id_order_service?: number;
  id_service?: number;
  price?: number;
  discount?: number;
  // Observe que agora chamaremos de suggestedDate localmente, mas você pode manter "suggested_date".
  // Basta adequar a nomenclatura onde achar melhor.
  suggested_date?: string;
}

interface UpdateServicesSelectorProps {
  onChange: (services: UpdateServiceSelection[]) => void;
  initialServices?: UpdateServiceSelection[];
}

// 1) Função para formatar a data ISO ("2025-03-24T18:56:10.456Z") para "YYYY-MM-DDTHH:mm"
function formatDateForInput(isoString?: string): string {
  if (!isoString) return "";

  const date = new Date(isoString);
  // Se quiser UTC exato, use getUTCFullYear / getUTCMonth / etc.
  // Abaixo gera data/hora local do usuário:
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Retorna o formato aceito pelo datetime-local: YYYY-MM-DDTHH:mm
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function UpdateServicesSelector({
  onChange,
  initialServices = [],
}: UpdateServicesSelectorProps) {
  const [availableServices, setAvailableServices] = useState<Services[]>([]);
  const [selectedServices, setSelectedServices] = useState<
    UpdateServiceSelection[]
  >([]);
  const { selectServices } = useSelectServices();

  // Carrega a lista de serviços disponíveis na montagem
  useEffect(() => {
    async function fetchServices() {
      const services = await selectServices();
      setAvailableServices(services);
    }
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Atualiza selectedServices sempre que initialServices mudar
  useEffect(() => {
    if (initialServices.length > 0) {
      setSelectedServices(initialServices);
    } else {
      setSelectedServices([
        {
          id_service: undefined,
          price: undefined,
          discount: 0,
          suggested_date: "",
        },
      ]);
    }
  }, [initialServices]);

  // Método interno para atualizar estado + notificar o pai
  function updateParent(updated: UpdateServiceSelection[]) {
    setSelectedServices(updated);
    onChange(updated);
  }

  function handleChange(
    index: number,
    field: keyof UpdateServiceSelection,
    value: any
  ) {
    const updated = [...selectedServices];
    updated[index] = { ...updated[index], [field]: value };
    updateParent(updated);
  }

  function handleServiceSelect(index: number, value: string) {
    const serviceId = Number(value);
    const foundService = availableServices.find(
      (s) => s.id_service === serviceId
    );
    const priceValue = foundService ? Number(foundService.price) : undefined;

    const updatedRow = {
      ...selectedServices[index],
      id_service: serviceId,
      price: priceValue,
    };
    const newSelected = [...selectedServices];
    newSelected[index] = updatedRow;
    updateParent(newSelected);
  }

  function addServiceRow() {
    updateParent([
      ...selectedServices,
      {
        id_service: undefined,
        price: undefined,
        discount: 0,
        suggested_date: "",
      },
    ]);
  }

  function removeServiceRow(index: number) {
    const updated = [...selectedServices];
    updated.splice(index, 1);
    updateParent(updated);
  }

  return (
    <div className="space-y-4">
      {selectedServices.map((service, index) => (
        <div key={index} className="flex gap-2 items-center">
          {/* Select de serviços */}
          <select
            className="border p-2 rounded"
            value={service.id_service ?? ""}
            onChange={(e) => handleServiceSelect(index, e.target.value)}
          >
            <option value="">Selecione um serviço</option>
            {availableServices.map((s) => (
              <option key={s.id_service} value={s.id_service}>
                {s.description}
              </option>
            ))}
          </select>

          {/* Preço e desconto */}
          <Input
            type="number"
            placeholder="Preço"
            value={service.price ?? ""}
            onChange={(e) =>
              handleChange(index, "price", Number(e.target.value))
            }
          />

          <Input
            type="number"
            placeholder="Desconto"
            value={service.discount ?? ""}
            onChange={(e) =>
              handleChange(index, "discount", Number(e.target.value))
            }
          />

          {/* Data/hora sugerida (datetime-local) */}
          <Input
            type="datetime-local"
            // Aqui formatamos a data ISO (se houver) para "YYYY-MM-DDTHH:mm"
            value={formatDateForInput(service.suggested_date)}
            onChange={(e) =>
              // se quiser converter de volta p/ ISO já aqui, use parseDateFromInput
              // handleChange(index, "suggested_date", parseDateFromInput(e.target.value))
              handleChange(index, "suggested_date", e.target.value)
            }
          />

          <Button variant="destructive" onClick={() => removeServiceRow(index)}>
            Remover
          </Button>
        </div>
      ))}

      <Button type="button" onClick={addServiceRow}>
        Adicionar Serviço
      </Button>
    </div>
  );
}
