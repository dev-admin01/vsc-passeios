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
  data: Services[];
}
