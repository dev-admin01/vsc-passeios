// app/LayoutClient.tsx
"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/ui/sidebar";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  // Podemos usar hooks de client aqui
  const pathname = usePathname();
  const hideSidebar = pathname === "/" || pathname === "/status";

  return (
    <>
      {!hideSidebar && <Sidebar />}
      {children}
    </>
  );
}
