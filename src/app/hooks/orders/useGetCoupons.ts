"use client";

import useSWR from "swr";
import { api } from "@/services/api";
import { Coupon } from "@/types/coupon.types";

export interface GetCouponResponse {
  coupons: Coupon[];
  page: number;
  perpage: number;
  totalCount: number;
  lastPage: number;
}

const fetchCoupons = async () => {
  const response = await api.get<GetCouponResponse>("/api/coupons", {
    params: { page: 1, perpage: 100 }, // Buscar todos os cupons
  });
  return response.data;
};

export function useGetCoupons() {
  const { data, error, isLoading } = useSWR<GetCouponResponse>(
    "get-coupons-all",
    fetchCoupons,
  );

  return {
    coupons: data?.coupons.filter((coupon) => coupon.active) || [],
    loading: isLoading,
    error,
  };
}
