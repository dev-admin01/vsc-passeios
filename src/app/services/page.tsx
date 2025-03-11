"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useServices } from "../hooks/useServices";
import { Services } from "@/types/service.types";

// Tipagem de serviço (ajuste conforme seu back-end)

export default function ServicesPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  // Passando os parâmetros para o hook
  const { data, isLoading, error } = useServices(page, limit, search);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1); // Retorna para a página 1 ao alterar a busca
  }

  function previousPage() {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }

  function nextPage() {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  }
  console.log("page:", data);

  return (
    <div className="sm:ml-15 p-5 space-y-6">
      <h1 className="text-2xl font-bold">Services</h1>

      {/* Campo de busca */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Buscar descrição..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Tabela de serviços */}
      <Table>
        <TableCaption>Lista de Serviços</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Observação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={4}>Carregando...</TableCell>
            </TableRow>
          )}

          {error && (
            <TableRow>
              <TableCell colSpan={4}>Erro ao carregar os serviços.</TableCell>
            </TableRow>
          )}

          {data
            ? data.map((item: Services) => (
                <TableRow key={item.id_service}>
                  <TableCell>{item.id_service}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.observation}</TableCell>
                </TableRow>
              ))
            : !isLoading && (
                <TableRow>
                  <TableCell colSpan={4}>Nenhum serviço encontrado.</TableCell>
                </TableRow>
              )}
        </TableBody>
      </Table>

      {/* Paginação */}
      <div className="flex items-center justify-center gap-4">
        <Button onClick={previousPage} disabled={page === 1}>
          Anterior
        </Button>
        <span>
          Página {page} de {totalPages}
        </span>
        <Button onClick={nextPage} disabled={page === totalPages}>
          Próxima
        </Button>
      </div>
    </div>
  );
}
