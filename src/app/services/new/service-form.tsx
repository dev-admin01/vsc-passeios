import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const serviceSchema = z.object({
  description: z
    .string()
    .min(1, { message: "Descrição do passeio obrigatória." }),
  type: z.string().min(1, { message: "Escolha o tipo de passeio" }),
  price: z.string().min(1, { message: "Informe o valor do passeio" }),
  observation: z.string(),
  time: z.array(z.string()).optional(),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

export function useServiceForm() {
  return useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      description: "",
      type: "1",
      price: "",
      observation: "",
    },
  });
}
