import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const customerSchema = z.object({
  nome: z.string().min(1, { message: "Nome é obrigatório" }),
  email: z
    .string()
    .min(1, { message: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
  cpf_cnpj: z.string().min(1, { message: "CPF é obrigatório" }),
  rg: z.string().optional(),
  ddi: z.string().min(1, { message: "DDI é obrigatório" }).max(2, {
    message: "DDI deve ter no máximo 2 dígitos",
  }),
  ddd: z.string().min(1, { message: "DDD é obrigatório" }).max(2, {
    message: "DDD deve ter no máximo 2 dígitos",
  }),
  telefone: z.string().min(1, { message: "Telefone é obrigatório" }),
  indicacao: z.string().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

export function useCustomerForm() {
  return useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      nome: "",
      email: "",
      cpf_cnpj: "",
      rg: "",
      ddi: "",
      ddd: "",
      telefone: "",
      indicacao: "",
    },
  });
}
