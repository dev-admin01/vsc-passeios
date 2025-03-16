export interface Services {
  id_service?: string;
  description: string;
  type: number;
  price: number;
  observation?: string;
  created_at?: string;
  updated_ate?: string;
}

export interface ServicesResponse {
  services: {
    id_service: number;
    description: string;
    type: string;
    price: string;
    observation: string;
    created_at: string;
    updated_at: string;
  }[];
  page: number;
  perpage: number;
  lastPage: number;
  totalCount: number;
  status_code: number;
}

export interface CreateServicePayload {
  description: string;
  type: string;
  price: string;
  observation: string;
}

export interface ServiceData {
  id_service: number;
  description: string;
  type: string;
  price: string;
  observation: string;
}
