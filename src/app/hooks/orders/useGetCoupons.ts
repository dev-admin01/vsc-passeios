import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { getCookieclient } from "@/lib/cookieClient";

interface Coupon {
  id_coupons: string;
  coupon: string;
  discount: string;
  id_midia: number;
}

export function useGetCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const token = await getCookieclient();
        const response = await api.get("/api/coupons", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCoupons(response.data.coupons);
        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar cupons");
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  return { coupons, loading, error };
}
