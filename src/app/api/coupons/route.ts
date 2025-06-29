import { NextRequest, NextResponse } from "next/server";
import controller from "@/errors/controller";
import coupon from "@/models/coupon";

const unsupportedMethodHandler = () => controller.errorHandlers.onNoMatch();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perpage = parseInt(searchParams.get("perpage") || "10");
    const search = searchParams.get("search") || "";

    const coupons = await coupon.findAllWithPagination({
      page,
      perpage,
      search,
    });

    return NextResponse.json(coupons, { status: 200 });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const createdCoupon = await coupon.create(body);

    return NextResponse.json(createdCoupon, { status: 201 });
  } catch (error: any) {
    return controller.errorHandlers.onError(error);
  }
}

export const PUT = unsupportedMethodHandler;
export const DELETE = unsupportedMethodHandler;
export const PATCH = unsupportedMethodHandler;
