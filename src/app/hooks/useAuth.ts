"use client";

import { setCookie, deleteCookie } from "cookies-next";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import axios from "axios";

export interface AuthResp {
  statusCode: number;
  message?: string;
}

export interface User {
  id_user: string;
  email: string;
  name: string;
  token: string;
}

export interface AuthResponse {
  user: User;
}

// Transformando useAuth em um hook customizado com o prefixo "use"
export function useAuth() {
  const router = useRouter();
  // const [authLoading, setAuthLoading] = useState(false);

  // const { data: user, error, isLoading } = useSWR("/api/auth", fetcher);

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResp | undefined> => {
    try {
      const response = await api.post<AuthResponse>("/api/auth", {
        email,
        password,
      });

      if (!response.data.user.token) {
        return {
          statusCode: 400,
          message: "Token não encontrado na resposta",
        };
      }

      const cookieOptions = {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
        maxAge: 60 * 60 * 24, // 1 dia
        path: "/",
      };

      console.log("passou aqui");

      // Salva o token
      setCookie("vsc-session", response.data.user.token, cookieOptions);
      const userInfo = {
        id_user: response.data.user.id_user,
        name: response.data.user.name,
        email: response.data.user.email,
        id_position: response.data.user.id_user,
      };

      const dataUser = JSON.stringify(userInfo);

      setCookie("vsc-identify", dataUser, cookieOptions);

      router.push("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.data.status_code || 500;
        const message = error.response?.data.message || "Erro ao fazer login";
        return { statusCode, message };
      }
      console.error("Erro não tratado:", error);
      return {
        statusCode: 500,
        message: "Erro interno do servidor",
      };
    }
  };

  const logout = () => {
    try {
      const cookieOptions = {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
        path: "/",
      };

      deleteCookie("vsc-session", cookieOptions);
      deleteCookie("vsc-identify", cookieOptions);

      // Força a limpeza do cache do navegador
      window.localStorage.clear();
      window.sessionStorage.clear();

      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      router.push("/");
    }
  };

  return { login, logout };
}
