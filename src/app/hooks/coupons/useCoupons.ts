"use client";

import useSWR from "swr";
import { api } from "@/services/api";
import { toast } from "sonner";
import { getCookieclient } from "@/lib/cookieClient";

export interface Coupon {
  id_coupons: number;
  coupon: string;
  discount: string;
  id_midia: number;
  created_at: string;
  updated_at: string;
  midia: {
    id_midia: number;
    description: string;
  };
}

interface GetCouponsResponse {
  coupons: Coupon[];
  total: number;
}

interface CreateCouponResponse {
  id_coupons: number;
  coupon: string;
  discount: string;
  id_midia: number;
  created_at: string;
  updated_at: string;
}

interface CreateCouponData {
  coupon: string;
  discount: string;
  id_midia: number;
}

const fetchCoupons = async (page: number, perpage: number, search: string) => {
  const token = await getCookieclient();
  const response = await api.get<GetCouponsResponse>("/api/coupons", {
    params: { page, perpage, search },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export function useCoupons(
  page: number = 1,
  perPage: number = 10,
  search: string = ""
) {
  const { data, error, mutate } = useSWR<GetCouponsResponse>(
    ["get-coupons", page, perPage, search],
    () => fetchCoupons(page, perPage, search)
  );

  const createCoupon = async (data: CreateCouponData) => {
    try {
      const token = await getCookieclient();
      await api.post<CreateCouponResponse>("/api/coupons", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Cupom criado com sucesso!");
      mutate();
      return true;
    } catch (error) {
      console.log(error);
      toast.error("Erro ao criar cupom");
      return false;
    }
  };

  const updateCoupon = async (id: number, data: CreateCouponData) => {
    try {
      const token = await getCookieclient();
      await api.put(`/api/coupons/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Cupom atualizado com sucesso!");
      mutate();
      return true;
    } catch (error) {
      console.log(error);
      toast.error("Erro ao atualizar cupom");
      return false;
    }
  };

  const deleteCoupon = async (id: number) => {
    try {
      const token = await getCookieclient();
      await api.delete(`/api/coupons/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Cupom excluído com sucesso!");
      mutate();
      return true;
    } catch (error) {
      console.log(error);
      toast.error("Erro ao excluir cupom");
      return false;
    }
  };

  return {
    data,
    error,
    isLoading: !error && !data,
    createCoupon,
    updateCoupon,
    deleteCoupon,
  };
}
