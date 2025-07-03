export interface Services {
  id_service?: number;
  description?: string;
  type?: string;
  price?: string;
  observation?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  time?: string | string[];
}

export interface ServicesResponse {
  services: Services[];
  page: number;
  perpage: number;
  lastPage: number;
  totalCount: number;
}

export interface ServiceInputValues {
  description: string;
  type: string;
  price: string;
  observation: string;
  time: string;
}

export interface CreateServicePayload {
  description: string;
  type: string;
  price: string;
  observation: string;
  time: string[];
}

export interface ServiceData {
  id_service: number;
  description: string;
  type: string;
  price: string;
  observation: string;
  time: string;
}
