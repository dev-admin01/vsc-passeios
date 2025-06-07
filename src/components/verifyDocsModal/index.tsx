"use client";

import Image from "next/image";
import { useDocumentation } from "@/app/hooks/documentation/useDocumentation";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Image as ImageIcon, Eye } from "lucide-react";
import { useEffect, useState } from "react";

interface Document {
  id_order_documentation: number;
  name: string;
  file: string;
}

interface VerifyDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  idOrder: string;
  orderNumber: string;
  sendLoading?: boolean;
}

export function VerifyDocsModal({
  isOpen,
  onClose,
  onConfirm,
  idOrder,
  orderNumber,
  sendLoading = false,
}: VerifyDocsModalProps) {
  const { data, error, isLoading, mutate } = useDocumentation(idOrder);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const handleViewDocument = (doc: Document) => {
    setSelectedDoc(doc);
  };

  const handleCloseViewer = () => {
    setSelectedDoc(null);
  };

  const getFileType = (base64: string) => {
    const signature = base64.substring(0, 30);
    if (signature.includes("JVBERi0")) return "pdf";
    if (signature.includes("iVBORw0KGgo")) return "image";
    return "unknown";
  };

  useEffect(() => {
    if (isOpen) {
      mutate();
    }
  }, [isOpen, mutate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-4 rounded shadow-md max-w-md w-full">
        <h3 className="text-lg font-bold mb-2">
          Verificar Documentos do orçamento {orderNumber}
        </h3>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {error && <p>Erro ao carregar documentos</p>}
        {data && data.docsValidation.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold">Documentos</h4>
            <div className="space-y-2">
              {data.docsValidation.map((doc) => (
                <div
                  key={doc.id_order_documentation}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex items-center gap-2">
                    {getFileType(doc.file) === "pdf" ? (
                      <FileText className="h-5 w-5 text-red-500" />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-blue-500" />
                    )}
                    <span>{doc.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDocument(doc)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="destructive" onClick={onClose}>
            Fechar
          </Button>
          {data && data.docsValidation.length > 0 && (
            <Button
              variant="outline"
              onClick={onConfirm}
              disabled={sendLoading}
            >
              {sendLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Validar Documentos"
              )}
            </Button>
          )}
        </div>
      </div>

      {selectedDoc && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[60]">
          <div className="bg-white p-4 rounded shadow-md max-w-4xl w-full h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{selectedDoc.name}</h3>
              <Button variant="outline" size="sm" onClick={handleCloseViewer}>
                Fechar
              </Button>
            </div>
            <div className="flex-1 overflow-auto">
              {getFileType(selectedDoc.file) === "pdf" ? (
                <iframe
                  src={`data:application/pdf;base64,${selectedDoc.file}`}
                  className="w-full h-full"
                />
              ) : (
                <Image
                  src={`data:image/png;base64,${selectedDoc.file}`}
                  alt={selectedDoc.name}
                  className="max-w-full h-auto"
                  width={1000}
                  height={1000}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
