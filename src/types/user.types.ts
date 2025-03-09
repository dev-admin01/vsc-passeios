export interface createUserInput {
  name: string;
  email: string;
  password: string;
  id_position?: string;
  ddi?: string;
  ddd?: string;
  phone?: string;
}

export interface User {
  id_user?: string;
  name?: string;
  email?: string;
  password?: string;
  id_position?: string;
}

export interface authUserInput {
  email: string;
  password: string;
}
