export interface Customer {
  id_costumer?: string;
  nome?: string;
  email?: string;
  cpf_cnpj?: string;
  passaporte?: string;
  razao_social?: string | null;
  nome_fantasia?: string | null;
  ddi?: string;
  ddd?: string;
  telefone?: string;
  indicacao?: string;
  created_at?: string;
  updated_at?: string;
}

export type GetCustomerResponse = {
  costumer: Customer;
  status_code: number;
};

export interface ListCustomerResponse {
  customers: Customer[];
  page: number;
  perpage: number;
  lastPage: number;
  totalCount: number;
  status_code: number;
}

export interface CreateCustomerData {
  nome: string;
  email: string;
  telefone: string;
  ddi: string;
  ddd: string;
  cpf_cnpj: string;
  passaporte?: string | null;
  indicacao?: string | null;
}
