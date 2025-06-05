"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { AuthResp } from "../hooks/useAuth";

interface AuthContextType {
  login: (email: string, password: string) => Promise<AuthResp | undefined>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({
  children,
}: AuthProviderProps): React.ReactElement {
  const { login, logout } = useAuth();

  return (
    <AuthContext.Provider value={{ login, logout }}>
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
