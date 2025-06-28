"use client";

import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AuthResponse, AuthErrorResponse } from "@/types/auth.types";

// Transformando useAuth em um hook customizado com o prefixo "use"
export function useAuth() {
  const router = useRouter();

  const login = async (
    email: string,
    password: string,
  ): Promise<AuthResponse | AuthErrorResponse | undefined> => {
    try {
      const response = await api.post<AuthResponse>("/api/sessions", {
        email,
        password,
      });

      if (response.status !== 200) {
        return response.data as any;
      }

      if (!response.data.token) {
        return response.data;
      }

      router.push("/dashboard");
      return response.data; // Retorna os dados do usuário autenticado
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.data.status_code || 500;
        const message = error.response?.data.message || "Erro ao fazer login";
        return {
          status_code: statusCode,
          message,
          name: "AuthError",
          action: "Verifique se o email e a senha estão corretos",
        };
      }
      console.error("Erro não tratado:", error);
      return {
        status_code: 500,
        message: "Erro interno do servidor",
        name: "InternalServerError",
        action: "Tente novamente mais tarde",
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/sessions/logout");
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      router.push("/login");
    }
  };

  return { login, logout };
}
