"use client";

import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  LogOut,
  PanelBottom,
  Sailboat,
  Settings,
  ShoppingBag,
  TicketPercent,
  Users,
} from "lucide-react";
import { useAuthContext } from "@/app/contexts/authContext";

import {
  TooltipContent,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function Sidebar() {
  const { logout } = useAuthContext();

  return (
    <div className="flex w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-17 border-r sm:flex sm:flex-col bg-blue-800">
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
            <Link
              href="/dashboard"
              className="flex h-14 w-14 shrink-0 items-center justify-center  text-primary-foreground rounded-full"
            >
              <Image
                src="/logo.png"
                alt="Logo"
                width={100}
                height={100}
                className="mx-auto "
              />
              <span className="sr-only">Dashboard avatar</span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Home className="h-7 w-7 text-white" />
                  <span className="sr-only">incio</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Inicio</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/orders"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ShoppingBag className="h-7 w-7 text-white" />
                  <span className="sr-only">Orçamentos</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Orçamentos</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/services"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Sailboat className="h-7 w-7 text-white" />
                  <span className="sr-only">Passeios</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Passeios</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/customers"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Users className="h-7 w-7 text-white" />
                  <span className="sr-only">Clientes</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Clientes</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/coupons"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <TicketPercent className="h-7 w-7 text-white" />
                  <span className="sr-only">Cupons</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Cupons</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/settings"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Settings className="h-7 w-7 text-white" />
                  <span className="sr-only">Configurações</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Configurações</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>

        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={logout}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <LogOut className="h-7 w-7 text-red-500" />
                  <span className="sr-only">Sair</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Sair</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>

      <div className="sm:hiden flex flex-col sm:gap-4 sm:py-4 sm:pl-14  bg-sky-100">
        <header className="stick top-0 z-30 flex h-14 items-center px-4 border-b gap-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 mb-4 bg-sky-300 rounded-2xl">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelBottom className="w-5 h-5" />
                <VisuallyHidden>
                  <span className="sr-only">Abrir / fechar menu</span>
                </VisuallyHidden>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-4sm:max-w-x">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href={"#"}
                  className="m-3 flex h-15 w-15 rounded-full text-lg items-center justify-center text-primary-foreground md:text-base gap-2"
                  prefetch={false}
                >
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={100}
                    height={100}
                    className="mx-auto"
                  />
                  <span className="sr-only">Logo do projeto</span>
                </Link>

                <Link
                  href="/dashboard"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  prefetch={false}
                >
                  <Home className="h-5 w-5 transition-all" />
                  Inicio
                </Link>

                <Link
                  href="/orders"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  prefetch={false}
                >
                  <ShoppingBag className="h-5 w-5 transition-all" />
                  Orçamentos
                </Link>
                <Link
                  href="/services"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  prefetch={false}
                >
                  <Sailboat className="h-5 w-5 transition-all" />
                  Passeios
                </Link>
                <Link
                  href="/customers"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  prefetch={false}
                >
                  <Users className="h-5 w-5 transition-all" />
                  Clientes
                </Link>
                <Link
                  href="/coupons"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  prefetch={false}
                >
                  <TicketPercent className="h-5 w-5 transition-all" />
                  Cupons
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  prefetch={false}
                >
                  <Settings className="h-5 w-5 transition-all" />
                  Configurações
                </Link>

                <button
                  onClick={logout}
                  className="flex items-center gap-4 px-2.5 text-red-500 hover:text-red-600 transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5 transition-all" />
                  Sair
                </button>
              </nav>
            </SheetContent>
          </Sheet>
          <h2 className="sm:hidden">Menu</h2>
        </header>
      </div>
    </div>
  );
}
