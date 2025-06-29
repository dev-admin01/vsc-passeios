import prismaClient from "@/prisma";
import { Coupon, CouponInputValues } from "@/types/coupon.types";
import { NotFoundError, ValidationError } from "@/errors/errors";

async function create(couponInputValues: CouponInputValues) {
  if (!couponInputValues.coupon) {
    throw new ValidationError({
      message: "Cupom não informado.",
      action: "Informe um cupom para realizar esta operação.",
    });
  }

  await validateByCoupon(couponInputValues.coupon);

  const coupon = await runInsertQuery(couponInputValues);

  async function runInsertQuery(couponInputValues: CouponInputValues) {
    const coupon = await prismaClient.coupon.create({
      data: couponInputValues,
    });
    return coupon;
  }

  return coupon;
}

async function validateByCoupon(coupon: string) {
  const existingCoupon = await runFindQuery(coupon);

  async function runFindQuery(coupon: string) {
    const existingCoupon = await prismaClient.coupon.findUnique({
      where: { coupon },
    });

    if (existingCoupon) {
      throw new ValidationError({
        message: "Cupom já cadastrado.",
        action: "Ajuste os dados informados e tente novamente.",
      });
    }
    return existingCoupon;
  }

  return existingCoupon;
}

async function validateById(id: string) {
  const validateCoupon = await runValidateById(id);

  return validateCoupon;

  async function runValidateById(id: string) {
    const coupon = await prismaClient.coupon.findUnique({
      where: { id_coupons: id },
    });

    if (!coupon) {
      throw new NotFoundError({
        message: "Cupom não encontrado.",
        action: "Ajuste os dados informados e tente novamente.",
      });
    }
    return coupon;
  }
}

async function findAllWithPagination({
  page = 1,
  perpage = 10,
  search = "",
}: {
  page?: number;
  perpage?: number;
  search?: string;
}) {
  const offset = (page - 1) * perpage;

  const whereClause = search
    ? {
        coupon: { contains: search, mode: "insensitive" as const },
      }
    : {};

  const [coupons, totalCount] = await Promise.all([
    prismaClient.coupon.findMany({
      where: whereClause,
      skip: offset,
      take: perpage,
      orderBy: { created_at: "desc" },
      include: {
        midia: {
          select: {
            id_midia: true,
            description: true,
          },
        },
      },
    }),
    prismaClient.coupon.count({ where: whereClause }),
  ]);

  const lastPage = Math.ceil(totalCount / perpage);

  return {
    coupons,
    page,
    perpage,
    totalCount,
    lastPage,
  };
}

async function deleteById(id: string) {
  const validateCoupon = await validateById(id);

  const coupon = await runDeleteQuery(validateCoupon);

  async function runDeleteQuery(validateCoupon: Coupon) {
    const coupon = await prismaClient.coupon.delete({
      where: { id_coupons: validateCoupon.id_coupons },
    });

    if (!coupon) {
      throw new NotFoundError({
        message: "Cupom não encontrado.",
        action: "Ajuste os dados informados e tente novamente.",
      });
    }

    const deletedCoupon = {
      message: "Cupom deletado com sucesso.",
      status_code: 200,
    };
    return deletedCoupon;
  }

  return coupon;
}

async function updateById(id: string, couponInputValues: CouponInputValues) {
  const couponInDatabase = await validateById(id);

  if (!couponInputValues.coupon || couponInputValues.discount === "") {
    throw new ValidationError({
      message: "Cupom não informado.",
      action: "Informe um cupom para realizar esta operação.",
    });
  }

  if (couponInputValues.coupon !== couponInDatabase.coupon) {
    await validateByCoupon(couponInputValues.coupon);
  }

  const coupon = await runUpdateQuery(couponInDatabase);

  return coupon;

  async function runUpdateQuery(couponInDatabase: Coupon) {
    const coupon = await prismaClient.coupon.update({
      where: { id_coupons: couponInDatabase.id_coupons },
      data: couponInputValues,
    });

    return coupon;
  }
}

const coupon = {
  create,
  findAllWithPagination,
  deleteById,
  updateById,
};

export default coupon;
