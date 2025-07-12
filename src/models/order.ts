import prismaClient from "@/prisma";
import { ValidationError, NotFoundError } from "@/errors/errors";
import { ConvertCurrency } from "@/lib/shared/currencyConverter";
import { getCookieServer } from "@/lib/cookieServer";
import customer from "./customer";
import authentication from "./authentication";
import user from "./user";

export interface OrderInputValues {
  id_user: string;
  pre_name?: string;
  pre_email?: string;
  pre_ddi?: string;
  pre_ddd?: string;
  pre_phone?: string;
  pre_cpf_cnpj?: string;
  price?: string;
  id_customer?: string | null;
  id_cond_pag?: string | null;
  id_coupons?: string | null;
  hotel?: string;
  hotel_checkin?: Date;
  hotel_checkout?: Date;
  id_status_order?: number;
  order_number?: string;
  link_signature?: string;
  services: {
    id_service: number;
    price: string;
    quantity: number;
    discount?: number;
    suggested_date?: string;
    time?: string;
  }[];
}

export interface OrderUpdateValues {
  id_user?: string;
  pre_name?: string;
  pre_email?: string;
  pre_ddi?: string;
  pre_ddd?: string;
  pre_phone?: string;
  pre_cpf_cnpj?: string;
  price?: string;
  time?: string;
  id_customer?: string | null;
  id_cond_pag?: string;
  id_coupons?: string;
  hotel?: string;
  hotel_checkin?: Date;
  hotel_checkout?: Date;
  id_status_order?: number;
  order_number?: string;
  link_signature?: string;
  services?: {
    id_order_service?: number;
    id_service: number;
    price: string;
    quantity: number;
    discount?: number;
    suggested_date?: string;
    time?: string;
  }[];
}

async function create(orderInputValues: OrderInputValues) {
  await validateRequiredFields(orderInputValues);

  // Converter preço para centavos se fornecido
  if (orderInputValues.price) {
    orderInputValues.price = ConvertCurrency.realToCents(
      orderInputValues.price,
    );
  }

  const orderNumber = await lastOrder();
  orderInputValues.order_number = orderNumber;

  orderInputValues.id_status_order = 1;

  const newOrder = await runInsertQuery(orderInputValues);
  return newOrder;

  async function runInsertQuery(orderInputValues: OrderInputValues) {
    const { services, ...orderData } = orderInputValues;

    const newOrder = await prismaClient.order.create({
      data: {
        ...orderData,
        orders_service: {
          create: services.map((service) => ({
            id_service: service.id_service,
            price: service.price,
            quantity: service.quantity,
            discount: service.discount,
            suggested_date: service.suggested_date,
            time: service.time,
          })),
        },
      },
      select: {
        id_order: true,
        order_number: true,
        price: true,
        created_at: true,
        updated_at: true,
        orders_service: true,
        user: {
          select: {
            id_user: true,
            name: true,
            email: true,
            id_position: true,
            ddi: true,
            ddd: true,
            phone: true,
          },
        },
      },
    });

    return newOrder;
  }
}

async function updateById(
  id: string,
  orderInputValues: OrderUpdateValues,
): Promise<any> {
  await findOneById(id);

  if (Object.keys(orderInputValues).length === 0) {
    throw new ValidationError({
      message: "Pelo menos um campo deve ser informado para atualização.",
      action: "Informe os dados que deseja atualizar e tente novamente.",
    });
  }

  // Converter preço para centavos se fornecido
  if (orderInputValues.price) {
    orderInputValues.price = ConvertCurrency.realToCents(
      orderInputValues.price,
    );
  }
  if (orderInputValues.services) {
    orderInputValues.services.forEach((service) => {
      service.price = ConvertCurrency.realToCents(service.price);
    });
  }

  const updateData = {
    ...orderInputValues,
    updated_at: new Date(),
  };

  const updatedOrder = await runUpdateQuery(id, updateData);

  await updateStatus(id, 1);
  return updatedOrder;

  async function runUpdateQuery(id: string, updateData: any) {
    const { services, ...orderData } = updateData;

    const updatedOrder = await prismaClient.order.update({
      where: { id_order: id },
      data: {
        ...orderData,
        ...(services && {
          orders_service: {
            deleteMany: {}, // Remove todos os services existentes
            create: services.map((service: any) => ({
              id_service: service.id_service,
              price: service.price,
              quantity: service.quantity,
              discount: service.discount,
              suggested_date: service.suggested_date
                ? new Date(service.suggested_date)
                : undefined,
              time: service.time,
            })),
          },
        }),
      },
      include: {
        orders_service: {
          include: {
            service: true,
          },
        },
      },
    });

    // Converter preço de volta para formato real
    if (updatedOrder.price) {
      updatedOrder.price = ConvertCurrency.centsToReal(updatedOrder.price);
    }

    updatedOrder.orders_service.forEach((service) => {
      if (service.price) {
        service.price = ConvertCurrency.centsToReal(service.price);
      }
    });

    return updatedOrder;
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

  let id_user = null;
  let jwtToken = null;
  let userPosition = null;

  jwtToken = await getCookieServer();

  if (jwtToken) {
    id_user = await authentication.validateToken(jwtToken);

    if (id_user) {
      const userStored = await user.findOneById(id_user as string);
      userPosition = userStored?.id_position;
    }
  }

  let baseWhere = {};

  if (userPosition && userPosition > 2) {
    baseWhere = { id_user: id_user as string };
  }

  const whereClause = search
    ? {
        ...baseWhere,
        OR: [
          { id_order: { contains: search, mode: "insensitive" as const } },
          { order_number: { contains: search, mode: "insensitive" as const } },
          { pre_name: { contains: search, mode: "insensitive" as const } },
          { pre_email: { contains: search, mode: "insensitive" as const } },
          {
            user: { name: { contains: search, mode: "insensitive" as const } },
          },
          {
            customer: {
              nome: { contains: search, mode: "insensitive" as const },
            },
          },
          {
            status: {
              description: { contains: search, mode: "insensitive" as const },
            },
          },
        ],
      }
    : baseWhere;

  const [orders, totalCount] = await Promise.all([
    prismaClient.order.findMany({
      where: whereClause,
      skip: offset,
      take: perpage,
      orderBy: { created_at: "desc" },
      include: {
        orders_service: {
          include: {
            service: true,
          },
        },
        user: true,
        customer: true,
        status: true,
        cond_pag: true,
        coupons: true,
        order_documentation: true,
      },
    }),
    prismaClient.order.count({ where: whereClause }),
  ]);

  const lastPage = Math.ceil(totalCount / perpage);

  // Converter preços de volta para formato real
  orders.forEach((order) => {
    if (order.price) {
      order.price = ConvertCurrency.centsToReal(order.price);
    }
  });

  return {
    orders,
    page,
    perpage,
    totalCount,
    lastPage,
  };
}

async function deleteById(id: string) {
  await findOneById(id);

  const deletedOrder = await runDeleteQuery(id);
  return deletedOrder;

  async function runDeleteQuery(id_order: string) {
    // O Prisma automaticamente deleta os registros relacionados devido ao onDelete: Cascade
    const deletedOrder = await prismaClient.order.delete({
      where: { id_order },
    });

    return {
      id_order: deletedOrder.id_order,
    };
  }
}

async function findOneById(id: string) {
  const orderFound = await runSelectQuery(id);
  return orderFound;

  async function runSelectQuery(id: string) {
    const order = await prismaClient.order.findUnique({
      where: { id_order: id },
      include: {
        orders_service: {
          include: {
            service: true,
          },
        },
        user: true,
        customer: true,
        status: true,
        cond_pag: true,
        coupons: true,
        order_documentation: true,
      },
    });

    if (!order) {
      throw new NotFoundError({
        message: "O pedido não foi encontrado no sistema.",
        action: "Verifique se o ID está correto.",
      });
    }

    // Converter preço de volta para formato real
    if (order.price) {
      order.price = ConvertCurrency.centsToReal(order.price);
    }

    order.orders_service.forEach((service) => {
      if (service.price) {
        service.price = ConvertCurrency.centsToReal(service.price);
      }
    });

    return order;
  }
}

async function validateRequiredFields(orderInputValues: OrderInputValues) {
  if (
    !orderInputValues.pre_cpf_cnpj ||
    !orderInputValues.pre_name ||
    !orderInputValues.pre_email ||
    !orderInputValues.pre_phone
  ) {
    throw new ValidationError({
      message: "Dados de contato invalidos, preencha todos os campos.",
      action:
        "É necessário informar todos os campos de contato para realizar esta operação.",
    });
  }

  if (!orderInputValues.services || orderInputValues.services.length === 0) {
    throw new ValidationError({
      message: "Serviços não informados.",
      action: "Informe pelo menos um serviço para realizar esta operação.",
    });
  }
}

async function lastOrder() {
  const lastOrder = await prismaClient.order.findFirst({
    orderBy: { created_at: "desc" },
    select: {
      order_number: true,
    },
  });

  let sequence = 1;
  if (lastOrder && lastOrder.order_number) {
    const lastSequence = parseInt(lastOrder.order_number.substring(0, 4));
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    } else {
      sequence = 1;
    }
  }

  const sequenceStr = sequence.toString().padStart(4, "0");

  const now = new Date();
  const monthStr = (now.getMonth() + 1).toString().padStart(2, "0");
  const yearStr = now.getFullYear().toString().slice(-2);

  const orderNumber = `${sequenceStr}${monthStr}${yearStr}`;

  return orderNumber;
}

async function updateStatus(id_order: string, id_status_order: number) {
  const statusOrder = await prismaClient.order.update({
    where: { id_order },
    data: { id_status_order },
  });
  return statusOrder;
}

async function updateDocumentation(payload: any) {
  const storedOrder = await findOneById(payload.id_order);

  const customerData = {
    nome: payload.name,
    email: payload.email,
    cpf_cnpj: payload.cpf_cnpj,
    rg: payload.rg,
    ddi: payload.ddi,
    ddd: payload.ddd,
    telefone: payload.phone,
    indicacao: payload.indicacao || null,
  };

  let storedCustomer;
  if (storedOrder.customer) {
    storedCustomer = await customer.updateById(
      storedOrder.customer.id_customer,
      customerData,
    );
  } else {
    storedCustomer = await customer.create(customerData);
  }

  await prismaClient.order.update({
    where: { id_order: payload.id_order },
    data: {
      id_customer: storedCustomer.id_customer,
      hotel: payload.hotel,
      hotel_checkin: payload.hotelCheckin,
      hotel_checkout: payload.hotelCheckout,
    },
  });
  await prismaClient.orderDocumentation.create({
    data: {
      id_order: storedOrder.id_order,
      name: `CNH ${storedOrder.order_number}`,
      file: payload.cnh,
    },
  });
  await prismaClient.orderDocumentation.create({
    data: {
      id_order: storedOrder.id_order,
      name: `Comp. Pagamento ${storedOrder.order_number}`,
      file: payload.compPag,
    },
  });

  await updateStatus(storedOrder.id_order, 6);
}

async function approveDocumentation(payload: any) {
  const storedOrder = await findOneById(payload.id_order);

  const appliedPrice = await checkAppliedCoupon(
    storedOrder,
    payload.id_cond_pag,
  );

  const updatedOrder = await prismaClient.order.update({
    where: { id_order: storedOrder.id_order },
    data: {
      price: appliedPrice,
      id_cond_pag: payload.id_cond_pag,
      id_status_order: 8,
    },
  });

  if (!updatedOrder) {
    throw new NotFoundError({
      message: "Erro ao aprovar documentação.",
      action: "Tente novamente mais tarde.",
    });
  }

  return updatedOrder;
}

export async function checkAppliedCoupon(
  storedOrder: any,
  id_cond_pag: string,
) {
  const storedCondPag = await prismaClient.condicaoPagamento.findUnique({
    where: { id_cond_pag },
  });

  if (
    storedOrder.id_coupons &&
    storedCondPag?.description.toLowerCase() === "pix"
  ) {
    return storedOrder.price;
  }

  if (
    !storedOrder.id_coupons &&
    storedCondPag?.description.toLowerCase() === "pix"
  ) {
    const priceInCents = ConvertCurrency.realToCents(storedOrder.price);

    const discountPercentage = parseFloat(storedCondPag.discount) / 100;

    const discountInCents = Math.round(
      parseInt(priceInCents, 10) * discountPercentage,
    );

    const finalPriceInCents = parseInt(priceInCents, 10) - discountInCents;

    console.log(
      "finalPrice",
      ConvertCurrency.centsToReal(finalPriceInCents.toString()),
    );

    return finalPriceInCents.toString();
  }

  return storedOrder.price;
}

async function sendContract(id_order: string, link_signature: string) {
  console.log("id_order", id_order);
  console.log("link_signature", link_signature);

  const statusOrder = await prismaClient.order.update({
    where: { id_order },
    data: {
      link_signature,
      id_status_order: 9,
    },
  });
  return statusOrder;
}

async function invalidateDocumentation(id_order: string) {
  // Remove todos os documentos relacionados ao pedido
  await prismaClient.orderDocumentation.deleteMany({
    where: { id_order },
  });

  // Atualiza o status do pedido para 5 (aguardando documentos)
  const updatedOrder = await prismaClient.order.update({
    where: { id_order },
    data: { id_status_order: 5 },
  });

  return updatedOrder;
}

const order = {
  create,
  findAllWithPagination,
  deleteById,
  updateById,
  findOneById,
  updateStatus,
  updateDocumentation,
  approveDocumentation,
  sendContract,
  invalidateDocumentation,
};

export default order;
