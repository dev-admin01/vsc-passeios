export interface User {
  id_user?: string;
  name: string;
  email: string;
  password: string;
  id_position?: number;
  ddi?: string;
  ddd?: string;
  phone?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserInputValues extends User {
  id_position: number;
}

export interface authUserInput {
  email: string;
  password: string;
}
