"use client";

import { setCookie } from "cookies-next/client";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import axios from "axios";

export interface AuthResp {
  statusCode: number;
}

// Transformando useAuth em um hook customizado com o prefixo "use"
export function useAuth() {
  const router = useRouter();

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResp | undefined> => {
    try {
      const response = await api.post("/api/auth", { email, password });

      if (!response.data.user.token) {
        return { statusCode: 400 };
      }

      const expressTime = 60 * 60 * 24;
      setCookie("vsc-session", response.data.user.token, {
        maxAge: expressTime,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
      });

      setCookie("vsc-identify", response.data.user.id_user, {
        maxAge: expressTime,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
      });

      // Redirecionamento no client-side usando router.push
      router.push("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { statusCode: error.response?.data.status_code };
      }
      console.error(error);
      return { statusCode: 500 };
    }
  };

  return { login };
}
