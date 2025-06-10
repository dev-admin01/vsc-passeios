"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceFormData, useServiceForm } from "./service-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { useCreateService } from "@/app/hooks/service/useCreateService";

import { Sidebar } from "@/components/sidebar";
import Link from "next/link";

export default function NewServices() {
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [hoursModalIsOpen, setHoursModalIsOpen] = useState(false);
  const { createService } = useCreateService();
  const form = useServiceForm();

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

  function toggleHour(hour: string) {
    setSelectedHours((prev) =>
      prev.includes(hour)
        ? prev.filter((h) => h !== hour)
        : [...prev, hour].sort()
    );
    console.log(selectedHours);
  }

  async function onSubmit(values: ServiceFormData) {
    const serviceData = {
      ...values,
      time: selectedHours,
    };
    console.log(serviceData);
    const service = await createService(serviceData);

    if (service.status !== 201) {
      toast.error(service.data.message, { closeButton: true });
    }

    toast.success(service.data.message, { closeButton: true });
    form.reset();
    setSelectedHours([]);
  }

  function changeCurrency(event: React.ChangeEvent<HTMLInputElement>) {
    let { value } = event.target;
    value = value.replace(/\D/g, "");

    if (value) {
      value = (parseInt(value, 10) / 100).toFixed(2);
      value = value.replace(".", ",");
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    event.target.value = value;
    form.setValue("price", value);
  }

  return (
    <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
      <Sidebar />
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-2">Novo Passeio</h1>
        <Link href="/services" title="Voltar">
          <Button className="cursor-pointer">
            <ArrowLeft />
          </Button>
        </Link>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição do passeio</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do passeio" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carteira de motorista</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue="2">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Necessário CNH?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">Selecione</SelectItem>
                          <SelectItem value="0">Não</SelectItem>
                          <SelectItem value="1">Sim</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Valor do passeio"
                        onChange={changeCurrency}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="observation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observação</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label className="font-semibold">
                  Configurar horários do passeio
                </Label>
                <Dialog
                  open={hoursModalIsOpen}
                  onOpenChange={setHoursModalIsOpen}
                >
                  <DialogTrigger asChild className="w-full">
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      Clique aqui para selecionar os horários
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
                        Marque ou desmarque os horários disponiveis para o
                        passeio
                      </p>
                      <div className="grid grid-cols-5 gap-2">
                        {hours.map((hour) => (
                          <Button
                            key={hour}
                            variant="outline"
                            className={cn(
                              "h-10",
                              selectedHours.includes(hour) &&
                                "border-2 border-sky-500 text-primary font-semibold"
                            )}
                            onClick={() => toggleHour(hour)}
                          >
                            {hour}
                          </Button>
                        ))}
                      </div>
                    </section>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setHoursModalIsOpen(false);
                      }}
                    >
                      Fechar horários
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>

              <Button
                type="submit"
                className="w-full bg-sky-300 hover:bg-sky-800 text-black"
              >
                Salvar Passeio
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
