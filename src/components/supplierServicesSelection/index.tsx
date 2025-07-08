"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Services } from "@/types/service.types";
import { useService } from "@/app/hooks/services/useService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Badge removido - não existe no projeto

interface SupplierServicesSelectionProps {
  selectedServiceIds: number[];
  onServiceToggle: (serviceId: number, isSelected: boolean) => void;
  disabled?: boolean;
}

export function SupplierServicesSelection({
  selectedServiceIds,
  onServiceToggle,
  disabled = false,
}: SupplierServicesSelectionProps) {
  const [availableServices, setAvailableServices] = useState<Services[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { selectServices } = useService();

  useEffect(() => {
    async function fetchServices() {
      try {
        const services = await selectServices();
        setAvailableServices(services);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchServices();
  }, [selectServices]);

  const handleServiceToggle = (serviceId: number, isChecked: boolean) => {
    onServiceToggle(serviceId, isChecked);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Serviços Oferecidos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Carregando serviços...</p>
        </CardContent>
      </Card>
    );
  }

  if (availableServices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Serviços Oferecidos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Nenhum serviço disponível no momento.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços Oferecidos</CardTitle>
        <p className="text-sm text-gray-600">
          Selecione os serviços que este fornecedor oferece
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableServices.map((service) => (
            <div
              key={service.id_service}
              className={`p-4 border rounded-lg transition-all ${
                selectedServiceIds.includes(service.id_service || 0)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              onClick={() => {
                if (!disabled && service.id_service) {
                  const isSelected = selectedServiceIds.includes(
                    service.id_service
                  );
                  handleServiceToggle(service.id_service, !isSelected);
                }
              }}
            >
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id={`service-${service.id_service}`}
                  checked={selectedServiceIds.includes(service.id_service || 0)}
                  onChange={(e) => {
                    if (!disabled && service.id_service) {
                      handleServiceToggle(service.id_service, e.target.checked);
                    }
                  }}
                  disabled={disabled}
                  className="w-4 h-4 mt-1 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex-1 min-w-0">
                  <Label
                    htmlFor={`service-${service.id_service}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {service.description}
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      Tipo: {service.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      R$ {service.price}
                    </span>
                  </div>
                  {service.observation && (
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {service.observation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedServiceIds.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Serviços selecionados: {selectedServiceIds.length}
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedServiceIds.map((serviceId) => {
                const service = availableServices.find(
                  (s) => s.id_service === serviceId
                );
                return service ? (
                  <span
                    key={serviceId}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                  >
                    {service.description}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
