"use client";

import useSWR from "swr";
import { api } from "@/services/api";
import { toast } from "sonner";
import { Coupon } from "@/types/coupon.types";

export interface GetCouponResponse {
  coupons: Coupon[];
  page: number;
  perpage: number;
  totalCount: number;
  lastPage: number;
}

export interface DeleteCouponResponse {
  message: string;
  status_code: number;
}

const fetchCoupons = async (page: number, perpage: number, search: string) => {
  const response = await api.get<GetCouponResponse>("/api/coupons", {
    params: { page, perpage, search },
  });
  return response.data;
};

export function useCoupon(
  page: number = 1,
  perpage: number = 10,
  search: string = "",
) {
  const { data, error, isLoading, mutate } = useSWR<GetCouponResponse>(
    ["get-coupons", page, perpage, search],
    () => fetchCoupons(page, perpage, search),
  );

  const createCoupon = async (couponData: {
    coupon: string;
    discount: string;
    id_midia: number;
  }): Promise<any> => {
    const response = await api.post("/api/coupons", couponData);

    if (response.status !== 201) {
      toast.error(response.data.message);
      return null;
    }

    toast.success("Cupom criado com sucesso!");
    mutate();
    return response.data;
  };

  const updateCoupon = async (
    id: string,
    couponData: {
      coupon: string;
      discount: string;
      id_midia: number;
    },
  ): Promise<any> => {
    const response = await api.patch(`/api/coupons/${id}`, couponData);

    if (response.status !== 200) {
      toast.error(response.data.message);
      return false;
    }

    toast.success("Cupom atualizado com sucesso!");
    mutate();
    return response.data;
  };

  const deleteCoupon = async (id: string): Promise<boolean> => {
    const response = await api.delete(`/api/coupons/${id}`);

    if (response.status !== 200) {
      toast.error(response.data.message);
      return false;
    }

    toast.success(response.data.message || "Cupom excluído com sucesso!");
    mutate();
    return true;
  };

  return {
    data,
    error,
    isLoading,
    createCoupon,
    updateCoupon,
    deleteCoupon,
  };
}
