"use client";

import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Settings, Image, CreditCard, Users } from "lucide-react";
import { Sidebar } from "@/components/sidebar";

export default function SettingsPage() {
  const router = useRouter();

  const settingsCards = [
    {
      title: "Usuários",
      description: "Gerencie usuários do sistema",
      icon: <Users className="w-6 h-6" />,
      path: "/users",
    },
    {
      title: "Mídia",
      description: "Gerencie suas mídias",
      icon: <Image className="w-6 h-6" />,
      path: "/midia",
    },
    {
      title: "Condição de Pagamento",
      description: "Configure as condições de pagamento",
      icon: <CreditCard className="w-6 h-6" />,
      path: "/condicao-pagamento",
    },
  ];

  return (
    <div className="sm:ml-17 p-4 min-h-screen bg-sky-100">
      <Sidebar />
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Configurações</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsCards.map((card, index) => (
          <Card
            key={index}
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 bg-white"
            onClick={() => router.push(card.path)}
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-sky-200 rounded-lg">{card.icon}</div>
              <div>
                <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
                <p className="text-muted-foreground">{card.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
