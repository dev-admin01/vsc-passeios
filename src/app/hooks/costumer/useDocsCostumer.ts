import { api } from "@/services/api";

interface DocsPayload {
  id_order: string;
  cpf_cnpj?: string;
  passaport?: string;
  name: string;
  email?: string;
  ddi?: string;
  ddd?: string;
  phone?: string;
  compPag?: string;
  cnh?: string;
}

function compressBase64(base64String: string): string {
  if (!base64String) return "";
  const base64Data = base64String.split(",")[1] || base64String;
  return base64Data;
}

export const usePostDocsCostumer = () => {
  const postDoc = async (costumerData: DocsPayload) => {
    try {
      const compressedData = {
        ...costumerData,
        compPag: costumerData.compPag
          ? compressBase64(costumerData.compPag)
          : undefined,
        cnh: costumerData.cnh ? compressBase64(costumerData.cnh) : undefined,
      };

      const response = await api.put("/api/orderdocs", compressedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      throw error;
    }
  };

  return {
    postDoc,
  };
};
