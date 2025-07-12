"use client";

import { Sidebar } from "@/components/sidebar";

import { ChartOverview } from "@/components/chart/index";
import { ChartValues } from "@/components/chart/chartValues";
import {
  Clock10,
  DollarSign,
  Loader2,
  ShoppingBagIcon,
  User,
} from "lucide-react";
import { useAuthContext } from "../contexts/authContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "../hooks/dashboard/useDashboard";
import DashboardCard from "@/components/dashboardCard";

export default function Dashboard() {
  const { user, loading } = useAuthContext();
  const {
    data,
    // isLoading, error, mutate
  } = useDashboard(user?.id_user || null, user?.id_position || null);

  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="min-h-screen p-4 bg-sky-100 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="sm:ml-17 min-h-screen  p-4 bg-sky-100">
      <Sidebar />
      <div className="p-6 sm:-mt-15">
        <div className="mb-4">
          <p className="text-gray-600">
            Bem-vindo,{" "}
            <span className="font-semibold">
              {user.name.split(" ")[0].charAt(0).toUpperCase() +
                user.name.split(" ")[0].slice(1).toLowerCase()}
            </span>
            !
          </p>
        </div>
      </div>
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <DashboardCard
          title="Abertos"
          description="Pendente pagamento"
          icon={<ShoppingBagIcon className="ml-auto w-5 h-5" />}
          count={data?.openOrders || 0}
          type="Orçamentos"
        />
        <DashboardCard
          title="Atrasados"
          description="Com mais de 2 dias sem atualização"
          icon={<Clock10 className="ml-auto w-5 h-5" />}
          count={data?.lateOrders || 0}
          type="Orçamentos"
        />
        <DashboardCard
          title="Faturados"
          description="Orçamentos faturados"
          icon={<DollarSign className="ml-auto w-5 h-5" />}
          count={data?.invoicedOrders || 0}
          type="Orçamentos"
        />
        <DashboardCard
          title="Aguardando cliente"
          description="Orçamentos aguardando status do cliente"
          icon={<User className="ml-auto w-5 h-5" />}
          count={data?.waitClientOrders || 0}
          type="Orçamentos"
        />
      </section>
      <section className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartOverview data={data?.monthlyOrdersChart} />
        <ChartValues data={data?.monthlyValuesChart} />
      </section>
    </main>
  );
}
