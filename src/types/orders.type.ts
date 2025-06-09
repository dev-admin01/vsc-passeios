// Exemplo: types/order.types.ts
export interface Order {
  id_order: string;
  order_number: string;
  price: number;
  created_at: string;
  user: { name: string };
  status?: { description: string; id_status_order: number } | null;
  order_documentation?: OrderDocumentation[];
  pre_name: string;
  pre_email: string;
  pre_phone: string;
  pre_ddd: string;
  pre_ddi: string;
  costumer: Costumer;
}

export interface OrderPDFProps {
  id_user: string;
  order_number?: string;
  pre_name?: string;
  pre_email?: string;
  pre_ddi?: string;
  pre_ddd?: string;
  pre_phone?: string;
  price?: string;
  orders_service: {
    id_order_service: number;
    id_service: number;
    discount: number;
    price: string;
    suggested_date: string;
    quantity: number;
    time: string;
    service: {
      description: string;
    };
  }[];
  coupons?: {
    id_coupon: number;
    coupon: string;
    discount: string;
  };
  cond_pag?: CondicaoPagamentoPDFProps;
}

export interface EmailOrderProps {
  id_order: string;
  order_number: string;
  pre_name?: string;
  pre_email?: string;
  costumer?: Costumer | undefined;
}

export interface OrdersResponse {
  orders: Order[];
  page: number;
  perpage: number;
  lastPage: number;
  totalCount: number;
  status_code: number;
}

export interface OrderDocumentation {
  id_order_documentation: number;
  file?: number[]; // array de bytes
  // ... outros campos
}

export interface Costumer {
  id_costumer: string;
  nome: string;
  cpf_cnpj?: string;
  passaporte?: string;
  razao_social?: string;
  nome_fantasia?: string;
  ddi?: string;
  ddd?: string;
  telefone?: string;
  indicacao?: string;
}

export interface CondicoesPagamento {
  condicoesPagamento: CondicaoPagamentoPDFProps[];
}

export interface CondicaoPagamentoPDFProps {
  id_cond_pag?: string;
  description: string;
  installments: string;
  discount: string;
  created_at?: string;
  updated_at?: string;
}

export interface PDFData {
  pdfData: {
    order: OrderPDFProps;
    condPag: CondicaoPagamentoPDFProps;
  };
}
