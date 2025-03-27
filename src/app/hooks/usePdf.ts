"use client";

import { useCallback } from "react";

/**
 * Este hook recebe um array de bytes (fileBytes) e abre o PDF em uma nova aba.
 */
export const useOpenPDF = () => {
  const openPDF = useCallback((fileBytes: number[]) => {
    if (!fileBytes || fileBytes.length === 0) {
      alert("Nenhum arquivo PDF encontrado.");
      return;
    }
    // Converte array de números em Uint8Array
    const byteArray = new Uint8Array(fileBytes);
    // Cria um Blob do tipo PDF
    const blob = new Blob([byteArray], { type: "application/pdf" });
    // Gera uma URL temporária para esse Blob
    const url = URL.createObjectURL(blob);
    // Abre em nova aba
    window.open(url, "_blank");
  }, []);

  return { openPDF };
};
