// Rotas que apenas managers (1) e admins (2) podem acessar
const adminOnlyRoutes = [
  "/users",
  "/services",
  "/coupons",
  "/midia",
  "/settings",
  "/condicao-pagamento",
  "/suppliers",
];

// Função para verificar se o usuário tem permissão para acessar uma rota
export function hasPermissionForRoute(
  userPosition: number,
  pathname: string
): boolean {
  // Managers (1) e Admins (2) têm acesso total
  if (userPosition === 1 || userPosition === 2) {
    return true;
  }

  // Sellers (3) e Operators (4) não podem acessar rotas administrativas
  if (userPosition === 3 || userPosition === 4) {
    return !adminOnlyRoutes.includes(pathname);
  }

  // Por padrão, negar acesso
  return false;
}

// Função para verificar se o usuário pode ver um item de navegação
export function hasNavigationPermission(
  userPosition: number,
  navigationKey: string
): boolean {
  // Managers (1) e Admins (2) podem ver tudo
  if (userPosition === 1 || userPosition === 2) {
    return true;
  }

  // Sellers (3) e Operators (4) não podem ver configurações
  if (userPosition === 3 || userPosition === 4) {
    return navigationKey !== "settings";
  }

  // Por padrão, negar acesso
  return false;
}

// Função para redirecionar se não tiver permissão
export function getRedirectPath(userPosition: number): string {
  if (userPosition === 1 || userPosition === 2) {
    return "/dashboard";
  }

  if (userPosition === 3) {
    return "/dashboard";
  }

  if (userPosition === 4) {
    return "/dashboard";
  }

  return "/dashboard";
}
