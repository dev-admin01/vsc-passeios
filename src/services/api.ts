import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL,
  withCredentials: true, // CRÍTICO: Envia cookies automaticamente
  validateStatus: (status) => status < 500, // Não trata 4xx como erro
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para tratar respostas 401 (não autenticado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se receber 401, redirecionar para login
    if (error.response?.status === 401) {
      // Verificar se não estamos já na página de login
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
