"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useServiceForm } from "../../new/service-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetService } from "@/app/hooks/service/useGetService";
import { useUpdateService } from "@/app/hooks/service/useUpdateService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sidebar } from "@/components/sidebar";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function UpdateService() {
  const params = useParams();
  const router = useRouter();
  const { getService } = useGetService();
  const { updateService } = useUpdateService();
  const form = useServiceForm();
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [hoursModalIsOpen, setHoursModalIsOpen] = useState(false);

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
        : [...prev, hour].sort(),
    );
  }

  useEffect(() => {
    async function loadService() {
      try {
        const service = await getService(Number(params.id));

        // Formata o preço antes de definir no form
        let formattedPrice = service.price;
        if (formattedPrice) {
          formattedPrice = formattedPrice.toString().replace(/\D/g, "");
          formattedPrice = (parseInt(formattedPrice, 10) / 100).toFixed(2);
          formattedPrice = formattedPrice.replace(".", ",");
          formattedPrice = formattedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }

        form.reset({
          description: service.description,
          type: service.type,
          price: formattedPrice,
          observation: service.observation,
        });

        // Carrega os horários existentes
        if (service.time) {
          try {
            const timeArray =
              typeof service.time === "string"
                ? JSON.parse(service.time)
                : service.time;

            if (Array.isArray(timeArray)) {
              setSelectedHours(timeArray);
            }
          } catch (error) {
            console.error("Erro ao fazer parse dos horários:", error);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar serviço:", error);
      }
    }

    loadService();
  }, [params.id, getService, form]);

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

  async function onSubmit(values: any) {
    try {
      const serviceData = {
        ...values,
        time: JSON.stringify(selectedHours),
      };

      const response = await updateService(Number(params.id), serviceData);

      if (response.status_code === 200) {
        toast.success("Passeio atualizado com sucesso!", {
          closeButton: true,
        });
        router.push("/services");
      } else {
        toast.error("Erro ao atualizar passeio", {
          closeButton: true,
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
      toast.error("Erro ao atualizar passeio", {
        closeButton: true,
      });
    }
  }

  return (
    <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
      <Sidebar />
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Editar Passeio</h1>
        <Button>
          <Link href="/services" title="Voltar">
            <ArrowLeft />
          </Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>Editar Passeio</CardHeader>
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue>
                            {field.value == "0"
                              ? "Não"
                              : field.value == "1"
                                ? "Sim"
                                : "Selecione"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
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
                                "border-2 border-sky-500 text-primary font-semibold",
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
                Atualizar Passeio
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
