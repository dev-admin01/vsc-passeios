import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { getCookieclient } from "@/lib/cookieClient";

interface CondicaoPagamento {
  id_cond_pag: number;
  description: string;
  installments: string;
  discount: string;
  created_at: string;
  updated_at: string;
}

interface ListCondicaoPagamentoResponse {
  condicoesPagamento: CondicaoPagamento[];
  page: number;
  perpage: number;
  lastPage: number;
  totalCount: number;
}

export function useGetCondPag() {
  const [condPag, setCondPag] = useState<CondicaoPagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCondPag = async () => {
      try {
        const token = await getCookieclient();
        const response = await api.get("/api/condicao-pagamento", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCondPag(response.data.condicoesPagamento);
        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar condições de pagamento");
        setLoading(false);
      }
    };

    fetchCondPag();
  }, []);

  return { condPag, loading, error };
}
