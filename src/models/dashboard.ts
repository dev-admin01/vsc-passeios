import user from "./user";
import prismaClient from "@/prisma";
import { ConvertCurrency } from "@/lib/shared/currencyConverter";

async function getDashboard(id_user: string, id_position: number) {
  await user.findOneById(id_user);

  const baseWhere =
    id_position === 1 || id_position === 2
      ? {
          id_status_order: {
            notIn: [10, 7],
          },
        }
      : {
          id_user: id_user as string,
          id_status_order: {
            notIn: [10, 7],
          },
        };
  const openOrders = await getOpenOrders(baseWhere);

  const baseWhereLate =
    id_position === 1 || id_position === 2
      ? {
          id_status_order: {
            notIn: [10, 7],
          },
          updated_at: {
            lt: new Date(new Date().setDate(new Date().getDate() - 2)), // < 2 dias atrás
          },
        }
      : {
          id_user: id_user as string,
          id_status_order: {
            notIn: [10, 7],
          },
          updated_at: {
            lt: new Date(new Date().setDate(new Date().getDate() - 2)), // < 2 dias atrás
          },
        };

  const lateOrders = await getLateOrders(baseWhereLate);

  const baseWhereInvoiced =
    id_position === 1 || id_position === 2
      ? {
          id_status_order: 10,
        }
      : {
          id_user: id_user as string,
          id_status_order: 10,
        };

  const invoicedOrders = await getInvoicedOrders(baseWhereInvoiced);

  const baseWhereWaitClient =
    id_position === 1 || id_position === 2
      ? {
          id_status_order: { in: [2, 5, 9] },
        }
      : {
          id_user: id_user as string,
          id_status_order: { in: [2, 5, 9] },
        };

  const waitClientOrders = await getWaitClientOrders(baseWhereWaitClient);

  const monthlyOrdersChart = await getMonthlyOrdersChart(id_user, id_position);

  const monthlyValuesChart = await getMonthlyValuesChart(id_user, id_position);

  const dashboardData = {
    openOrders,
    lateOrders,
    invoicedOrders,
    waitClientOrders,
    monthlyOrdersChart,
    monthlyValuesChart,
  };

  return dashboardData;
}

async function getOpenOrders(baseWhere: any) {
  const openOrders = await runSelectQuery(baseWhere);

  return openOrders;

  async function runSelectQuery(baseWhere: any) {
    const orders = await prismaClient.order.count({
      where: baseWhere,
    });
    return orders;
  }
}

async function getLateOrders(baseWhereLate: any) {
  const lateOrders = await runSelectQuery(baseWhereLate);

  async function runSelectQuery(baseWhereLate: any) {
    const orders = await prismaClient.order.count({
      where: baseWhereLate,
    });
    return orders;
  }
  return lateOrders;
}

async function getInvoicedOrders(baseWhereInvoiced: any) {
  const invoicedOrders = await runSelectQuery(baseWhereInvoiced);
  return invoicedOrders;

  async function runSelectQuery(baseWhereInvoiced: any) {
    const orders = await prismaClient.order.count({
      where: baseWhereInvoiced,
    });
    return orders;
  }
}

async function getWaitClientOrders(baseWhereWaitClient: any) {
  const waitClientOrders = await runSelectQuery(baseWhereWaitClient);
  return waitClientOrders;

  async function runSelectQuery(baseWhereWaitClient: any) {
    const orders = await prismaClient.order.count({
      where: baseWhereWaitClient,
    });
    return orders;
  }
}

async function getMonthlyOrdersChart(id_user: string, id_position: number) {
  const baseWhere =
    id_position === 1 || id_position === 2
      ? {}
      : {
          id_user: id_user as string,
        };

  // Buscar pedidos do ano atual
  const currentDate = new Date();
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1); // 1º de janeiro do ano atual
  const endOfYear = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59); // 31 de dezembro do ano atual

  const orders = await prismaClient.order.findMany({
    where: {
      ...baseWhere,
      created_at: {
        gte: startOfYear,
        lte: endOfYear,
      },
    },
    select: {
      created_at: true,
      id_status_order: true,
    },
  });

  // Agrupar por mês
  const monthlyData = new Map();

  // Inicializar todos os meses do ano atual
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentDate.getFullYear(), i, 1);
    const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
    const monthName = date.toLocaleDateString("pt-BR", { month: "long" });

    monthlyData.set(monthKey, {
      month: monthName,
      total: 0,
      invoiced: 0,
    });
  }

  // Processar pedidos
  orders.forEach((order) => {
    const orderDate = new Date(order.created_at);
    const monthKey = orderDate.toISOString().slice(0, 7); // YYYY-MM

    if (monthlyData.has(monthKey)) {
      const monthData = monthlyData.get(monthKey);
      monthData.total += 1;

      if (order.id_status_order === 10) {
        monthData.invoiced += 1;
      }
    }
  });

  // Converter para array
  const chartData = Array.from(monthlyData.values());

  return chartData;
}

async function getMonthlyValuesChart(id_user: string, id_position: number) {
  const baseWhere =
    id_position === 1 || id_position === 2
      ? {}
      : {
          id_user: id_user as string,
        };

  // Buscar pedidos do ano atual
  const currentDate = new Date();
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1); // 1º de janeiro do ano atual
  const endOfYear = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59); // 31 de dezembro do ano atual

  const orders = await prismaClient.order.findMany({
    where: {
      ...baseWhere,
      created_at: {
        gte: startOfYear,
        lte: endOfYear,
      },
    },
    select: {
      created_at: true,
      id_status_order: true,
      price: true,
    },
  });

  // Agrupar por mês
  const monthlyData = new Map();

  // Inicializar todos os meses do ano atual
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentDate.getFullYear(), i, 1);
    const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
    const monthName = date.toLocaleDateString("pt-BR", { month: "long" });

    monthlyData.set(monthKey, {
      month: monthName,
      total: 0,
      invoiced: 0,
    });
  }

  // Processar pedidos
  orders.forEach((order) => {
    const orderDate = new Date(order.created_at);
    const monthKey = orderDate.toISOString().slice(0, 7); // YYYY-MM

    if (monthlyData.has(monthKey)) {
      const monthData = monthlyData.get(monthKey);
      const formattedPrice = ConvertCurrency.centsToReal(order?.price);
      const orderPrice = parseFloat(formattedPrice);

      monthData.total += orderPrice;

      if (order.id_status_order === 10) {
        monthData.invoiced += orderPrice;
      }
    }
  });

  // Converter para array
  const chartData = Array.from(monthlyData.values());

  return chartData;
}

const dashboard = {
  getDashboard,
};

export default dashboard;
