// hooks/costumer/useDocsCostumer.ts
import { api } from "@/services/api";
import useSWRMutation from "swr/mutation";

interface DocsPayload {
  id_order: string;
  cpf_cnpj?: string;
  passaport?: string;
  name: string;
  email?: string;
  ddi?: string;
  ddd?: string;
  phone?: string;
  compPag?: string;
  cnh?: string;
}

// Exemplo de função que chama uma API do Next.js ou seu backend direto
// Recebe `url` e `{ arg }` (o "arg" é o payload que passaremos no trigger)
async function postDocsCostumer(url: string, { arg }: { arg: DocsPayload }) {
  console.log(arg);
  const response = api.put(url, arg);
  return await response; // ou res.text(), depende do que sua API retorna
}

export function useDocsCostumer() {
  // useSWRMutation recebe a URL e a função que fará o request
  // você pode ajustar a URL "/api/docs" para o endpoint correto do seu backend
  const { trigger, isMutating, error, data } = useSWRMutation(
    "/api/orderdocs",
    postDocsCostumer
  );

  // Retorne para seu componente o que for necessário
  return {
    trigger, // função que dispara a mutation
    isMutating, // booleano que indica se está salvando
    error, // último erro que aconteceu
    dataDocs: data, // resposta do servidor
  };
}
