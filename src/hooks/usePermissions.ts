import { useAuthContext } from "@/app/contexts/authContext";
import {
  hasPermissionForRoute,
  hasNavigationPermission,
  getRedirectPath,
} from "@/lib/permissions";
import { useRouter } from "next/navigation";

export function usePermissions() {
  const { user } = useAuthContext();
  const router = useRouter();

  // Verificar se o usuário tem permissão para uma rota
  const hasRoutePermission = (pathname: string): boolean => {
    if (!user?.id_position) return false;
    return hasPermissionForRoute(user.id_position, pathname);
  };

  // Verificar se o usuário pode ver um item de navegação
  const hasNavPermission = (navigationKey: string): boolean => {
    if (!user?.id_position) return false;
    return hasNavigationPermission(user.id_position, navigationKey);
  };

  // Redirecionar se não tiver permissão para a rota atual
  const checkCurrentRoutePermission = (pathname: string) => {
    if (!user?.id_position) return;

    const hasPermission = hasPermissionForRoute(user.id_position, pathname);

    if (!hasPermission) {
      const redirectPath = getRedirectPath(user.id_position);
      router.push(redirectPath);
    }
  };

  return {
    hasRoutePermission,
    hasNavPermission,
    checkCurrentRoutePermission,
    userPosition: user?.id_position,
  };
}
