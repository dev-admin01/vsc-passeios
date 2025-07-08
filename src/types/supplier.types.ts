export enum Jurisdicao {
  BRASIL = "BRASIL",
  SAN_ANDRES = "SAN_ANDRES",
}

export interface Supplier {
  id_supplier: string;
  nome_fantasia: string;
  jurisdicao: Jurisdicao;

  // Campos Brasil
  cnpj?: string;
  razao_social?: string;
  inscricao_estadual?: string;

  // Campos San Andres
  tax_id?: string;
  registro_san?: string;
  license_number?: string;
  tipo_atividade?: string;

  // Campos comuns
  email?: string;
  telefone?: string;
  endereco?: string;
  data_cadastro: Date;

  // Relacionamentos
  service_supplier?: ServiceSupplier[];
}

export interface ServiceSupplier {
  id_service_supplier: number;
  id_service: number;
  id_supplier: string;
  created_at: Date;
  updated_at: Date;

  // Relacionamentos
  service?: {
    id_service: number;
    description: string;
    type: string;
    price: string;
    time: string;
    observation: string;
  };
  supplier?: Supplier;
}

export interface CreateSupplierRequest {
  nome_fantasia: string;
  jurisdicao: Jurisdicao;

  // Campos Brasil
  cnpj?: string;
  razao_social?: string;
  inscricao_estadual?: string;

  // Campos San Andres
  tax_id?: string;
  registro_san?: string;
  license_number?: string;
  tipo_atividade?: string;

  // Campos comuns
  email?: string;
  telefone?: string;
  endereco?: string;

  // Services associados
  service_ids?: number[];
}

export interface UpdateSupplierRequest {
  nome_fantasia?: string;
  jurisdicao?: Jurisdicao;

  // Campos Brasil
  cnpj?: string;
  razao_social?: string;
  inscricao_estadual?: string;

  // Campos San Andres
  tax_id?: string;
  registro_san?: string;
  license_number?: string;
  tipo_atividade?: string;

  // Campos comuns
  email?: string;
  telefone?: string;
  endereco?: string;

  // Services associados
  service_ids?: number[];
}

export interface SuppliersResponse {
  suppliers: Supplier[];
  page: number;
  perpage: number;
  total: number;
  lastPage: number;
}
