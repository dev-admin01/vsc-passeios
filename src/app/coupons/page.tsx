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
import { useCoupons, Coupon } from "../hooks/coupons/useCoupons";
import { Edit, Trash2, Plus } from "lucide-react";
import { EditCouponModal } from "@/components/editCouponModal";
import { DeleteCouponModal } from "@/components/deleteCouponModal";
import { CreateCouponModal } from "@/components/createCouponModal";
import { Input } from "@/components/ui/input";

export default function CouponsPage() {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // const [page, setPage] = useState(1);
  const page = 1;
  const [search, setSearch] = useState("");
  const perPage = 10;

  const { data, isLoading, deleteCoupon } = useCoupons(page, perPage, search);

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsEditModalOpen(true);
  };

  const handleDelete = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedCoupon) {
      const success = await deleteCoupon(selectedCoupon.id_coupons);
      if (success) {
        setIsDeleteModalOpen(false);
      }
    }
  };
  console.log("data", data);

  return (
    <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
      <Sidebar />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cupons</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Buscar cupons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 bg-amber-50"
          />
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Cupom
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
            ) : !data?.coupons || data.coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Nenhum cupom cadastrado
                </TableCell>
              </TableRow>
            ) : (
              data.coupons.map((coupon) => (
                <TableRow key={coupon.id_coupons}>
                  <TableCell>{coupon.coupon}</TableCell>
                  <TableCell>{coupon.discount}</TableCell>
                  <TableCell>{coupon.midia.description}</TableCell>
                  <TableCell>
                    {new Date(coupon.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(coupon)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(coupon)}
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
          />
        </>
      )}

      <CreateCouponModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}
