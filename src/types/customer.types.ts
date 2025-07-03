export interface Customer {
  id_customer?: string;
  nome: string;
  email: string;
  cpf_cnpj?: string;
  rg?: string;
  razao_social?: string | null;
  nome_fantasia?: string | null;
  ddi?: string;
  ddd?: string;
  telefone?: string;
  indicacao?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CustomerInputValues {
  nome: string;
  email: string;
  cpf_cnpj?: string;
  rg?: string;
  razao_social?: string;
  nome_fantasia?: string;
  ddi?: string;
  ddd?: string;
  telefone?: string;
  indicacao?: string;
}

export interface GetCustomerResponse {
  customer: Customer;
  status_code: number;
}

export interface ListCustomerResponse {
  customers: Customer[];
  page: number;
  perpage: number;
  lastPage: number;
  totalCount: number;
}

export interface CreateCustomerData {
  nome: string;
  email: string;
  telefone?: string;
  ddi?: string;
  ddd?: string;
  cpf_cnpj?: string;
  rg?: string;
  razao_social?: string;
  nome_fantasia?: string;
  indicacao?: string;
}

export interface CustomersResponse {
  customers: Customer[];
  page: number;
  perpage: number;
  totalCount: number;
  lastPage: number;
}
