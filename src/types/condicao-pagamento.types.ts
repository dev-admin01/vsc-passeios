export interface CondicaoPagamento {
  id_cond_pag: string;
  description: string;
  installments: string;
  discount: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface CondicaoPagamentoInputValues {
  description: string;
  installments: string;
  discount: string;
}
