"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Services } from "@/types/service.types";
import { useSelectServices } from "@/app/hooks/service/useSelectServices";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

// Atualize a interface para incluir discount
export interface ServiceSelection {
  id_service?: number;
  price?: string | number;
  discount?: number;
  suggestedDate?: string;
  quantity?: number;
  time?: string[];
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
      quantity: 1,
      suggestedDate: "",
      time: [],
    },
  ]);
  const [hoursModalIsOpen, setHoursModalIsOpen] = useState<number | null>(null);
  const [availableHours, setAvailableHours] = useState<string[]>([]);

  const { selectServices } = useSelectServices();

  function generateTimeSlots(): string[] {
    const hours: string[] = [];
    for (let i = 7; i <= 23; i++) {
      for (let j = 0; j < 2; j++) {
        const hour = i.toString().padStart(2, "0");
        const minute = (j * 30).toString().padStart(2, "0");
        hours.push(`${hour}:${minute}`);
      }
    }
    return hours;
  }

  const hours = generateTimeSlots();

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
    const price = selectedService ? selectedService.price : undefined;
    const time = selectedService?.time ? JSON.parse(selectedService.time) : [];
    const updated = {
      ...selectedServices[index],
      id_service: serviceId,
      price: price,
      time: [],
    };
    const newSelectedServices = [...selectedServices];
    newSelectedServices[index] = updated;
    setSelectedServices(newSelectedServices);
  };

  const toggleHour = (index: number, hour: string) => {
    const updated = [...selectedServices];
    if (updated[index].time?.includes(hour)) {
      updated[index] = {
        ...updated[index],
        time: [],
      };
    } else {
      updated[index] = {
        ...updated[index],
        time: [hour],
      };
    }
    setSelectedServices(updated);
  };

  const addServiceRow = () => {
    setSelectedServices([
      ...selectedServices,
      {
        id_service: undefined,
        quantity: 1,
        price: undefined,
        discount: 0,
        suggestedDate: "",
        time: [],
      },
    ]);
  };

  const removeServiceRow = (index: number) => {
    const updated = [...selectedServices];
    updated.splice(index, 1);
    setSelectedServices(updated);
  };

  const openHoursModal = (index: number) => {
    const service = selectedServices[index];
    if (service.id_service) {
      const selectedService = availableServices.find(
        (s) => s.id_service === service.id_service
      );
      if (selectedService?.time) {
        setAvailableHours(JSON.parse(selectedService.time));
      }
    }
    setHoursModalIsOpen(index);
  };

  return (
    <div className="space-y-4">
      {selectedServices.map((service, index) => (
        <div key={index} className="flex flex-col gap-2 p-4 border rounded-lg">
          <div className="flex gap-2 items-center w-full">
            <div className="flex-1">
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
              <label className="font-semibold">Quantidade:</label>
              <Input
                type="number"
                min="1"
                value={service.quantity || 1}
                onChange={(e) =>
                  handleChange(index, "quantity", Number(e.target.value))
                }
              />
            </div>
            <div>
              <label className="font-semibold">Preço (R$):</label>
              <Input
                type="text"
                value={service.price !== undefined ? service.price : ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d,]/g, "");
                  handleChange(index, "price", value);
                }}
                placeholder="0,00"
              />
            </div>
            {/* <div>
              <label className="font-semibold">Desconto (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                step="1"
                disabled
                value={service.discount !== undefined ? service.discount : ""}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= 0 && value <= 100) {
                    handleChange(index, "discount", value);
                  }
                }}
              />
            </div> */}
            <div>
              <label className="font-semibold">Data sugerida</label>
              <Input
                type="date"
                placeholder="Data sugerida"
                value={service.suggestedDate || ""}
                onChange={(e) =>
                  handleChange(index, "suggestedDate", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">
                Configurar horários do passeio
              </Label>
              <Dialog
                open={hoursModalIsOpen === index}
                onOpenChange={(open) => {
                  if (open) {
                    openHoursModal(index);
                  } else {
                    setHoursModalIsOpen(null);
                  }
                }}
              >
                <DialogTrigger asChild className="w-full">
                  <Button variant="outline" className="w-full justify-between">
                    {service.time && service.time.length > 0
                      ? service.time[0]
                      : "Selecionar horários"}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Horários do passeio</DialogTitle>
                    <DialogDescription>
                      Selecione abaixo os horários em que o passeio está
                      disponível
                    </DialogDescription>
                  </DialogHeader>
                  <section className="py-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Marque ou desmarque os horários disponiveis para o passeio
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {availableHours.map((hour) => (
                        <Button
                          key={hour}
                          variant="outline"
                          className={cn(
                            "h-10",
                            service.time?.includes(hour) &&
                              "border-2 border-sky-500 text-primary font-semibold"
                          )}
                          onClick={() => toggleHour(index, hour)}
                        >
                          {hour}
                        </Button>
                      ))}
                    </div>
                  </section>
                  <Button
                    className="w-full"
                    onClick={() => setHoursModalIsOpen(null)}
                  >
                    Fechar horários
                  </Button>
                </DialogContent>
              </Dialog>
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
        </div>
      ))}
      <Button type="button" onClick={addServiceRow}>
        Adicionar Serviço
      </Button>
    </div>
  );
}
