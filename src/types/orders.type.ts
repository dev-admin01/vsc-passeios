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
  order: {
    id_user: string;
    order_number?: string;
    pre_name?: string;
    pre_email?: string;
    pre_ddi?: string;
    pre_ddd?: string;
    pre_phone?: string;
    price?: number;
    orders_service: {
      id_order_service: number;
      id_service: number;
      discount: number;
      price: number;
      suggested_date: string;
      service: {
        description: string;
      };
    }[];
  };
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
