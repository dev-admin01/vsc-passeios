import { User } from "./user.types";

export type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

export type AuthResponse = {
  token: string;
  authenticatedUser: User;
};

export type AuthErrorResponse = {
  name: string;
  message: string;
  action: string;
  status_code: number;
};
