"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sidebar } from "@/components/sidebar";
import {
  useCondicaoPagamento,
  CondicaoPagamento,
} from "../hooks/condicaoPagamento/useCondicaoPagamento";
import { Edit, Trash2, Plus } from "lucide-react";
import { EditCondicaoModal } from "@/components/editCondicaoModal";
import { DeleteCondicaoModal } from "@/components/deleteCondicaoModal";
import { CreateCondicaoModal } from "@/components/createCondicaoModal";
import { Input } from "@/components/ui/input";

export default function CondicaoPagamentoPage() {
  const [selectedCondicao, setSelectedCondicao] =
    useState<CondicaoPagamento | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const perPage = 10;

  const { data, isLoading, deleteCondicao } = useCondicaoPagamento(
    page,
    perPage,
    search
  );

  const handleEdit = (condicao: CondicaoPagamento) => {
    setSelectedCondicao(condicao);
    setIsEditModalOpen(true);
  };

  const handleDelete = (condicao: CondicaoPagamento) => {
    setSelectedCondicao(condicao);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedCondicao) {
      const success = await deleteCondicao(selectedCondicao.id_cond_pag);
      if (success) {
        setIsDeleteModalOpen(false);
      }
    }
  };
  return (
    <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
      <Sidebar />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Condições de Pagamento</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Buscar condições..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-amber-50 w-64"
          />
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Condição
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Parcelas</TableHead>
              <TableHead>Desconto</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : !data?.condicoesPagamento ||
              data.condicoesPagamento.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Nenhuma condição de pagamento cadastrada
                </TableCell>
              </TableRow>
            ) : (
              data.condicoesPagamento.map((condicao) => (
                <TableRow key={condicao.id_cond_pag}>
                  <TableCell>{condicao.description}</TableCell>
                  <TableCell>{condicao.installments}</TableCell>
                  <TableCell>{condicao.discount}%</TableCell>
                  <TableCell>
                    {new Date(condicao.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(condicao)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(condicao)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedCondicao && (
        <>
          <EditCondicaoModal
            condicao={selectedCondicao}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={() => {}}
          />
          <DeleteCondicaoModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirm}
          />
        </>
      )}

      <CreateCondicaoModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          setSearch("");
        }}
      />
    </div>
  );
}
