import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ChartOverview } from "@/components/chart/index";
import { Brain, Clock10, DollarSign, ShoppingBagIcon } from "lucide-react";

export default function Dashboard() {
  return (
    <main className="sm:ml-14 p-4">
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                Abertos
              </CardTitle>
              <ShoppingBagIcon className="ml-auto w-5 h-5" />
            </div>
            <CardDescription className="text-sm">
              Pendente pagamento
            </CardDescription>
          </CardHeader>
          <CardContent>10 Orçamentos</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                Atrasados
              </CardTitle>
              <Clock10 className="ml-auto w-5 h-5" />
            </div>
            <CardDescription className="text-sm">
              Pagamento expirado
            </CardDescription>
          </CardHeader>
          <CardContent>5 Orçamentos</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                Faturados
              </CardTitle>
              <DollarSign className="ml-auto w-5 h-5" />
            </div>
            <CardDescription className="text-sm">
              Orçamentos pagos
            </CardDescription>
          </CardHeader>
          <CardContent>18 Orçamentos</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                Pensando
              </CardTitle>
              <Brain className="ml-auto w-5 h-5" />
            </div>
            <CardDescription className="text-sm">
              completar 4 cards
            </CardDescription>
          </CardHeader>
          <CardContent>18 Orçamentos</CardContent>
        </Card>
      </section>

      <section className="mt-4 flex md:flex-row gap-4">
        <ChartOverview />
      </section>
    </main>
  );
}
