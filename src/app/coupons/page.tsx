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
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useCoupon } from "../hooks/coupons/useCoupon";
import { Coupon } from "@/types/coupon.types";
import { Edit, Trash2, Plus, ToggleLeft, ToggleRight } from "lucide-react";
import { EditCouponModal } from "@/components/editCouponModal";
import { DeleteCouponModal } from "@/components/deleteCouponModal";
import { CreateCouponModal } from "@/components/createCouponModal";
import { Input } from "@/components/ui/input";

export default function CouponsPage() {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isToggleLoading, setIsToggleLoading] = useState<string | null>(null);
  // const [page, setPage] = useState(1);
  const page = 1;
  const [search, setSearch] = useState("");
  const perPage = 10;

  const { data, isLoading, deleteCoupon, toggleActive } = useCoupon(
    page,
    perPage,
    search,
  );

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsEditModalOpen(true);
  };

  const handleDelete = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsDeleteModalOpen(true);
  };

  const handleToggleActive = async (coupon: Coupon) => {
    setIsToggleLoading(coupon.id_coupons);
    await toggleActive(coupon.id_coupons);
    setIsToggleLoading(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedCoupon) {
      setIsDeleteLoading(true);
      const success = await deleteCoupon(selectedCoupon.id_coupons!);
      if (success) {
        setIsDeleteLoading(false);
        setIsDeleteModalOpen(false);
        setSelectedCoupon(null);
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
        <Sidebar />
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Cupons</h1>
          <div className="flex gap-4">
            <Input
              placeholder="Buscar cupons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 bg-amber-50"
            />
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="cursor-pointer flex items-center justify-center sm:justify-center"
            >
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:block">Novo Cupom</span>
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cupom</TableHead>
                <TableHead>Desconto (%)</TableHead>
                <TableHead>Mídia</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : !data?.coupons || data.coupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Nenhum cupom cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                data.coupons.map((coupon) => (
                  <TableRow key={coupon.id_coupons}>
                    <TableCell>{coupon.coupon}</TableCell>
                    <TableCell>{coupon.discount}</TableCell>
                    <TableCell>{coupon.midia?.description}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          coupon.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {coupon.active ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {coupon.created_at
                        ? new Date(coupon.created_at).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(coupon)}
                        className="cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(coupon)}
                        className="cursor-pointer"
                        disabled={isToggleLoading === coupon.id_coupons}
                      >
                        {coupon.active ? (
                          <ToggleRight className="w-4 h-4 text-green-500" />
                        ) : (
                          <ToggleLeft className="w-4 h-4 text-red-500" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(coupon)}
                        className="cursor-pointer"
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

        {selectedCoupon && (
          <>
            <EditCouponModal
              coupon={selectedCoupon}
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onSuccess={() => {}}
            />
            <DeleteCouponModal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={handleDeleteConfirm}
              isLoading={isDeleteLoading}
            />
          </>
        )}

        <CreateCouponModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {}}
        />
      </div>
    </ProtectedRoute>
  );
}
