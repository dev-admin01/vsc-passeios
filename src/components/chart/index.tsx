"use client";

import { ShoppingBag } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { ChartContainer } from "../ui/chart";
import { type ChartConfig } from "@/components/ui/chart";
import {
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface MonthlyOrderData {
  month: string;
  total: number;
  invoiced: number;
}

interface ChartOverviewProps {
  data?: MonthlyOrderData[];
}

export function ChartOverview({ data }: ChartOverviewProps) {
  const chartData = data || [
    { month: "January", total: 0, invoiced: 0 },
    { month: "February", total: 0, invoiced: 0 },
    { month: "March", total: 0, invoiced: 0 },
    { month: "April", total: 0, invoiced: 0 },
    { month: "May", total: 0, invoiced: 0 },
    { month: "June", total: 0, invoiced: 0 },
  ];

  const chartConfig = {
    total: {
      label: "Total de Pedidos",
      color: "#2563eb",
    },
    invoiced: {
      label: "Pedidos Faturados",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}{" "}
              {entry.value === 1 ? "pedido" : "pedidos"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">
                Quantidade de Pedidos por Mês
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-1">
                Comparativo entre total de pedidos criados e pedidos faturados
              </CardDescription>
            </div>
            <ShoppingBag className="w-5 h-5 text-gray-500" />
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  content={({ payload }) => (
                    <div className="flex justify-center gap-6 text-sm">
                      {payload?.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-sm"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span>{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                />
                <Bar
                  dataKey="total"
                  fill="var(--color-total)"
                  radius={[2, 2, 0, 0]}
                  name="Total de Pedidos"
                />
                <Bar
                  dataKey="invoiced"
                  fill="var(--color-invoiced)"
                  radius={[2, 2, 0, 0]}
                  name="Pedidos Faturados"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
