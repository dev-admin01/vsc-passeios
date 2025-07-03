export interface User {
  id_user?: string;
  name: string;
  email: string;
  password: string;
  id_position?: number;
  ddi?: string | null;
  ddd?: string | null;
  phone?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserInputValues extends User {
  id_position: number;
}

export interface AuthenticatedUser
  extends Omit<
    User,
    "password" | "ddi" | "ddd" | "phone" | "created_at" | "updated_at"
  > {
  name: string;
}

export interface authUserInput {
  email: string;
  password: string;
}
