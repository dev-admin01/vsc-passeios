"use client";

import { useCallback } from "react";
import useSWR from "swr";
import { api } from "@/services/api";
import { toast } from "sonner";

import { DocumentosPDFResponse } from "@/types/documentos-pdf.types";

// Função para buscar documentos PDF
const fetchDocumentosPDF = async () => {
  const response = await api.get<DocumentosPDFResponse>("/api/documentos-pdf", {
    params: {
      page: 1,
      perpage: 10,
      search: "",
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// Hook para documentos PDF
export const useDocumentosPDF = () => {
  // Hook para listar documentos PDF - moved to top level
  const { data, error, isLoading, mutate } = useSWR<DocumentosPDFResponse>(
    ["get-documentos-pdf"],
    () => fetchDocumentosPDF()
  );

  const getDocumentosPDF = () => {
    return {
      data,
      isLoading,
      error,
      mutate,
    };
  };

  // Criar documento PDF
  const createDocumentoPDF = useCallback(async (documentoData: any) => {
    try {
      const response = await api.post("/api/documentos-pdf", documentoData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 201) {
        toast.error(response.data.message || "Erro ao criar documento PDF", {
          closeButton: true,
        });
        return false;
      }

      toast.success(`Documento PDF ${response.data.nome} criado com sucesso!`, {
        closeButton: true,
      });

      return response.data;
    } catch (error: any) {
      console.error("Erro ao criar documento PDF:", error);

      // Tratamento específico para erro 413 (Request Entity Too Large)
      if (error.response?.status === 413) {
        const errorMessage =
          error.response?.data?.message ||
          "Arquivos muito grandes. Reduza o tamanho dos PDFs e tente novamente.";

        toast.error(errorMessage, {
          closeButton: true,
          duration: 8000, // 8 segundos para dar tempo de ler
        });

        // Sugestões adicionais para o usuário
        setTimeout(() => {
          toast.info(
            "💡 Dica: Tente compactar os PDFs ou usar arquivos menores que 1.2MB",
            {
              closeButton: true,
              duration: 10000,
            },
          );
        }, 1000);

        return false;
      }

      const errorMessage =
        error.response?.data?.message || "Erro ao criar documento PDF";
      toast.error(errorMessage, { closeButton: true });
      return false;
    }
  }, []);

  // Atualizar documento PDF
  const updateDocumentoPDF = useCallback(async (id: string, data: any) => {
    try {
      const response = await api.put(`/api/documentos-pdf/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        toast.error(
          response.data.message || "Erro ao atualizar documento PDF",
          {
            closeButton: true,
          }
        );
        return false;
      }

      toast.success(
        `Documento PDF ${response.data.nome} atualizado com sucesso!`,
        {
          closeButton: true,
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Erro ao atualizar documento PDF:", error);

      // Tratamento específico para erro 413 (Request Entity Too Large)
      if (error.response?.status === 413) {
        const errorMessage =
          error.response?.data?.message ||
          "Arquivos muito grandes. Reduza o tamanho dos PDFs e tente novamente.";

        toast.error(errorMessage, {
          closeButton: true,
          duration: 8000, // 8 segundos para dar tempo de ler
        });

        // Sugestões adicionais para o usuário
        setTimeout(() => {
          toast.info(
            "💡 Dica: Tente compactar os PDFs ou usar arquivos menores que 1.2MB",
            {
              closeButton: true,
              duration: 10000,
            },
          );
        }, 1000);
        return false;
      }

      const errorMessage =
        error.response?.data?.message || "Erro ao atualizar documento PDF";
      toast.error(errorMessage, { closeButton: true });
      return false;
    }
  }, []);

  // Deletar documento PDF
  const deleteDocumentoPDF = useCallback(async (id: string) => {
    try {
      const response = await api.delete(`/api/documentos-pdf/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        toast.error(response.data.message, { closeButton: true });
        return false;
      }

      toast.success(`Documento PDF deletado com sucesso!`, {
        closeButton: true,
      });

      return true;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Erro ao deletar documento PDF",
        {
          closeButton: true,
        }
      );
      return false;
    }
  }, []);

  // Buscar documento PDF por ID
  const getDocumentoPDF = useCallback(async (id: string) => {
    try {
      const response = await api.get(`/api/documentos-pdf/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        toast.error(response.data.message, { closeButton: true });
        return null;
      }

      return response.data;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Erro ao buscar documento PDF",
        {
          closeButton: true,
        }
      );
      return null;
    }
  }, []);

  return {
    getDocumentosPDF,
    createDocumentoPDF,
    updateDocumentoPDF,
    deleteDocumentoPDF,
    getDocumentoPDF,
  };
};
