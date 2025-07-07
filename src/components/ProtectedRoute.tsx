"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const pathname = usePathname();
  const { checkCurrentRoutePermission } = usePermissions();

  useEffect(() => {
    checkCurrentRoutePermission(pathname);
  }, [pathname, checkCurrentRoutePermission]);

  return <>{children}</>;
}
