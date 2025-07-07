"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useAuth } from "../hooks/useAuth";
import { AuthResponse, AuthErrorResponse } from "@/types/auth.types";
import { api } from "@/services/api";

interface User {
  name: string;
  email: string;
  id_user: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
  ) => Promise<AuthResponse | AuthErrorResponse | undefined>;
  logout: () => void;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

export function AuthProvider({
  children,
}: AuthProviderProps): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { login: originalLogin, logout: originalLogout } = useAuth();

  const fetchUser = async () => {
    try {
      const response = await api.get("/api/me");
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await originalLogin(email, password);

    if (result && "token" in result) {
      await fetchUser();
    }

    return result;
  };

  const logout = async () => {
    await originalLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, fetchUser, setUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext deve ser usado dentro de um AuthProvider");
  }

  return context;
}
