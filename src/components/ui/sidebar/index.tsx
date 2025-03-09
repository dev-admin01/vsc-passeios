import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Home,
  Package,
  PanelBottom,
  ShoppingBag,
  User,
  Users2,
} from "lucide-react";

export function Sidebar() {
  return (
    <div className="flex w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="stick top-0 z-30 flex h-14 items-center px-4 border-b bg-background gap-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelBottom className="w-5 h-5" />
                <span className="sr-only">Abrir / fechar menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent className="p-4sm:max-w-x">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href={"#"}
                  className="flex h-10 w-10 bg-primary rounded-full text-lg items-center justify-center text-primary-foreground md:text-base gap-2"
                  prefetch={false}
                >
                  <Package className="h-5 w-5 transi" />
                  <span className="sr-only">Logo do projeto</span>
                </Link>

                <Link
                  href={"#"}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  prefetch={false}
                >
                  <Home className="h-5 w-5 transition-all" />
                  Inicio
                </Link>
                <Link
                  href={"#"}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  prefetch={false}
                >
                  <Users2 className="h-5 w-5 transition-all" />
                  Vendedores
                </Link>
                <Link
                  href={"#"}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  prefetch={false}
                >
                  <ShoppingBag className="h-5 w-5 transition-all" />
                  Orçamentos
                </Link>
                <Link
                  href={"#"}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  prefetch={false}
                >
                  <User className="h-5 w-5 transition-all" />
                  Criar usuário
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </header>
      </div>
    </div>
  );
}
