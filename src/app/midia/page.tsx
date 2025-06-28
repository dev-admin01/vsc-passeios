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
import { useMidia } from "../hooks/midia/useMidia";
import { Edit, Trash2, Plus } from "lucide-react";
import { EditMidiaModal } from "../../components/editMidiaModal";
import { DeleteMidiaModal } from "../../components/deleteMidiaModal";
import { CreateMidiaModal } from "../../components/createMidiaModal";
import { Input } from "@/components/ui/input";
import { Midia } from "@/types/midia.types";

export default function MidiaPage() {
  const [selectedMidia, setSelectedMidia] = useState<Midia | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  // const [page, setPage] = useState(1);
  const page = 1;
  const [search, setSearch] = useState("");
  const perPage = 10;

  const { data, isLoading, deleteMidia } = useMidia(page, perPage, search);

  const handleEdit = (midia: Midia) => {
    setSelectedMidia(midia);
    setIsEditModalOpen(true);
  };

  const handleDelete = (midia: Midia) => {
    setSelectedMidia(midia);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedMidia) {
      setIsDeleteLoading(true);
      const success = await deleteMidia(selectedMidia.id_midia!);
      if (success) {
        setIsDeleteModalOpen(false);
        setIsDeleteLoading(false);
      }
    }
  };

  return (
    <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
      <Sidebar />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mídias</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Buscar mídias..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-amber-50 w-64"
          />
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Mídia
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : !data?.midias || data.midias.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Nenhuma mídia cadastrada
                </TableCell>
              </TableRow>
            ) : (
              data.midias.map((midia) => (
                <TableRow key={midia.id_midia}>
                  <TableCell>{midia.description}</TableCell>
                  <TableCell>
                    {midia.created_at
                      ? new Date(midia.created_at).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(midia)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(midia)}
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

      {selectedMidia && (
        <>
          <EditMidiaModal
            midia={selectedMidia}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={() => {}}
          />
          <DeleteMidiaModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirm}
            isLoading={isDeleteLoading}
          />
        </>
      )}

      <CreateMidiaModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}
