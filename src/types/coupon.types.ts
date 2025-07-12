export interface Coupon {
  id_coupons: string;
  coupon: string;
  discount: string;
  id_midia: number;
  active: boolean;
  created_at?: string | Date;
  updated_at?: string | Date;
  midia?: {
    id_midia: number;
    description: string;
  };
}

export interface CouponInputValues {
  coupon: string;
  discount: string;
  id_midia: number;
  active?: boolean;
}
