type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

type User = {
  id_user: string;
  name: string;
  email: string;
  token: string;
};

export type { AuthContextType, User };
