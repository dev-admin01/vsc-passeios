import { NextRequest, NextResponse } from "next/server";
import coupon from "@/models/coupon";
import controller from "@/errors/controller";

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id_coupon: string }> }
) => {
  try {
    const { id_coupon } = await params;
    const deletedCoupon = await coupon.deleteById(id_coupon);
    return NextResponse.json(deletedCoupon);
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id_coupon: string }> }
) => {
  try {
    const { id_coupon } = await params;
    const couponInputValues = await request.json();

    const updatedCoupon = await coupon.updateById(id_coupon, couponInputValues);
    return NextResponse.json(updatedCoupon);
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
};
