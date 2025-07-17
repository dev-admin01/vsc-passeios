"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload, Save, Trash2 } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useDocumentosPDF } from "@/app/hooks/documentos-pdf/useDocumentosPDF";
import { toast } from "sonner";

export default function AnexosPadraoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [documento, setDocumento] = useState<any>(null);
  const [formData, setFormData] = useState({
    nome: "",
    arquivo_1_base64: "",
    arquivo_2_base64: "",
    arquivo_3_base64: "",
  });

  const {
    getDocumentosPDF,
    createDocumentoPDF,
    updateDocumentoPDF,
    deleteDocumentoPDF,
  } = useDocumentosPDF();

  const {
    data: documentosData,
    isLoading: isLoadingData,
    mutate,
  } = getDocumentosPDF();

  // Carregar dados existentes
  useEffect(() => {
    if (
      documentosData &&
      documentosData.documentos &&
      documentosData.documentos.length > 0
    ) {
      const doc = documentosData.documentos[0];
      setDocumento(doc);
      setFormData({
        nome: doc.nome || "",
        arquivo_1_base64: doc.arquivo_1_base64 || "",
        arquivo_2_base64: doc.arquivo_2_base64 || "",
        arquivo_3_base64: doc.arquivo_3_base64 || "",
      });
    }
  }, [documentosData]);

  const handleFileUpload = (
    fileNumber: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Apenas arquivos PDF são permitidos");
      return;
    }

    // Validar tamanho do arquivo (máximo 10MB)
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeInBytes) {
      toast.error("Arquivo muito grande. Tamanho máximo permitido: 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;

      // Validar tamanho do base64 (aproximadamente 1.33x maior que o arquivo original)
      const base64Size = base64.length;
      const estimatedMB = (base64Size / 1024 / 1024).toFixed(2);

      if (base64Size > 15 * 1024 * 1024) {
        // 15MB em base64 (considerando overhead)
        toast.error(
          `Arquivo muito grande após conversão (${estimatedMB}MB). Tente um arquivo menor.`
        );
        return;
      }

      setFormData((prev) => ({
        ...prev,
        [`arquivo_${fileNumber}_base64`]: base64,
      }));

      toast.success(
        `Arquivo ${fileNumber} carregado com sucesso (${estimatedMB}MB)`
      );
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.nome) {
        toast.error("Nome é obrigatório");
        return;
      }

      if (!formData.arquivo_1_base64) {
        toast.error("Arquivo 1 é obrigatório");
        return;
      }

      // Validar tamanho total dos arquivos base64 antes de enviar
      const totalSize =
        (formData.arquivo_1_base64?.length || 0) +
        (formData.arquivo_2_base64?.length || 0) +
        (formData.arquivo_3_base64?.length || 0);

      const totalMB = (totalSize / 1024 / 1024).toFixed(2);

      if (totalSize > 50 * 1024 * 1024) {
        // 50MB total
        toast.error(
          `Tamanho total dos arquivos muito grande (${totalMB}MB). Máximo permitido: 50MB`
        );
        return;
      }

      // Mostrar informação sobre o tamanho total
      toast.info(`Enviando ${totalMB}MB de arquivos...`);

      if (documento && documento.id) {
        // Atualizar documento existente
        const result = await updateDocumentoPDF(documento.id, formData);
        if (result) {
          mutate();
          toast.success("Documento atualizado com sucesso!");
        }
      } else {
        // Criar novo documento
        const result = await createDocumentoPDF(formData);
        if (result) {
          mutate();
          toast.success("Documento criado com sucesso!");
        }
      }
    } catch (error) {
      console.error("Erro ao salvar documento:", error);
      toast.error("Erro ao salvar documento");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!documento || !documento.id) {
      toast.error("Nenhum documento para deletar");
      return;
    }

    if (window.confirm("Tem certeza que deseja deletar este documento?")) {
      setIsLoading(true);
      try {
        const result = await deleteDocumentoPDF(documento.id);
        if (result) {
          mutate();
          setDocumento(null);
          setFormData({
            nome: "",
            arquivo_1_base64: "",
            arquivo_2_base64: "",
            arquivo_3_base64: "",
          });
          toast.success("Documento deletado com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao deletar documento:", error);
        toast.error("Erro ao deletar documento");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoadingData) {
    return (
      <ProtectedRoute>
        <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
          <Sidebar />
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Carregando...</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
        <Sidebar />
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Anexos Padrão</h1>
        </div>

        <Card className="p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Documento</Label>
              <Input
                id="nome"
                type="text"
                placeholder="Digite o nome do documento"
                value={formData.nome}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nome: e.target.value }))
                }
                required
              />
            </div>

            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">
                ℹ️ Informações sobre Upload de Arquivos
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Apenas arquivos PDF são aceitos</li>
                <li>• Tamanho máximo por arquivo: 10MB</li>
                <li>• Tamanho máximo total: 50MB</li>
                <li>• Suporta até 3 arquivos de 10MB cada</li>
                <li>
                  • Para arquivos grandes, use ferramentas online para compactar
                  PDFs
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Arquivo 1 */}
              <div className="space-y-2">
                <Label htmlFor="arquivo1">Arquivo 1 (Obrigatório)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="arquivo1"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileUpload(1, e)}
                    className="flex-1"
                  />
                  <Upload className="w-4 h-4 text-gray-500" />
                </div>
                {formData.arquivo_1_base64 && (
                  <div className="text-sm text-green-600">
                    ✓ Arquivo carregado
                  </div>
                )}
              </div>

              {/* Arquivo 2 */}
              <div className="space-y-2">
                <Label htmlFor="arquivo2">Arquivo 2 (Opcional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="arquivo2"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileUpload(2, e)}
                    className="flex-1"
                  />
                  <Upload className="w-4 h-4 text-gray-500" />
                </div>
                {formData.arquivo_2_base64 && (
                  <div className="text-sm text-green-600">
                    ✓ Arquivo carregado
                  </div>
                )}
              </div>

              {/* Arquivo 3 */}
              <div className="space-y-2">
                <Label htmlFor="arquivo3">Arquivo 3 (Opcional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="arquivo3"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileUpload(3, e)}
                    className="flex-1"
                  />
                  <Upload className="w-4 h-4 text-gray-500" />
                </div>
                {formData.arquivo_3_base64 && (
                  <div className="text-sm text-green-600">
                    ✓ Arquivo carregado
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isLoading ? "Salvando..." : documento ? "Atualizar" : "Criar"}
              </Button>

              {documento && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Deletar
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
