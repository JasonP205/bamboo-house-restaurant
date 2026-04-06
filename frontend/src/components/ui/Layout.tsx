import { useIsMobile } from "@/hooks/useIsMobile";
import ToggleLang from "./toggleLang";
import ToggleTheme from "./toggleTheme";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Avatar, Button, Drawer, Separator } from "@heroui/react";
import { useAuthStore } from "@/stores/useAuthStore";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import {
  Logout02Icon,
  Store01Icon,
  UserGroupIcon,
  ServingFoodIcon,
  Menu01Icon,
  AdvertisimentIcon,
  User03Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";

type NavItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
};

const Layout = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation(["common"]);
  const { logout, role, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, _setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const staffNavItems: NavItem[] = [
    {
      name: t("staffNavItems.orders"),
      path: "/app/orders",
      icon: <HugeiconsIcon icon={ServingFoodIcon} size={20} />,
    },
    {
      name: t("staffNavItems.branches"),
      path: "/app/branches",
      icon: <HugeiconsIcon icon={Store01Icon} size={20} />,
    },
    {
      name: t("staffNavItems.staff"),
      path: "/app/staffs",
      icon: <HugeiconsIcon icon={UserGroupIcon} size={20} />,
    },
  ];
  const managerNavItems: NavItem[] = [
    {
      name: t("staffNavItems.branches"),
      path: "/app/branches",
      icon: <HugeiconsIcon icon={Store01Icon} size={20} />,
    },
    {
      name: t("staffNavItems.advertise"),
      path: "/app/advertise",
      icon: <HugeiconsIcon icon={AdvertisimentIcon} size={20} />,
    },
  ];
  const navItems = role === "manager" ? managerNavItems : staffNavItems;

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  /* ───────────────────────── MOBILE ───────────────────────── */
  if (isMobile) {
    return (
      <div className="min-h-screen bg-surface text-on-surface">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-4 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10">
          <h1 className="font-serif italic text-lg text-primary">
            Bamboo House
          </h1>

          <Button
            isIconOnly
            variant="ghost"
            onPress={() => setMobileOpen(true)}
          >
            <HugeiconsIcon icon={Menu01Icon} />
          </Button>
        </header>

        {/* Drawer */}
        <Drawer.Backdrop isOpen={mobileOpen} onOpenChange={setMobileOpen}>
          <Drawer.Content placement="left" className="w-64">
            <Drawer.Dialog className="h-full bg-surface p-6 flex flex-col">
              <h2 className="font-serif italic text-xl mb-6">Menu</h2>

              <nav className="flex flex-col gap-2 flex-1">
                {navItems.map((item) => {
                  const isActive = location.pathname.includes(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "px-4 py-3 rounded-xl text-sm uppercase tracking-widest font-medium",
                        isActive
                          ? "bg-accent text-white"
                          : "text-on-surface/60 hover:bg-primary/10 hover:text-primary",
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <Button
                onPress={handleLogout}
                className="mt-auto uppercase tracking-widest"
                variant="ghost"
              >
                Logout
              </Button>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>

        {/* Content */}
        <main className="pt-20 pb-20 px-4">
          <Outlet />
        </main>

        {/* Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t flex justify-around py-3">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center text-[10px] uppercase tracking-tighter font-bold",
                  isActive ? "text-primary" : "text-on-surface/60",
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    );
  }

  /* ───────────────────────── DESKTOP ───────────────────────── */
  return (
    <div className="bg-background">
      {/* SIDEBAR */}
      <aside
        className={cn(
          "hidden md:flex flex-col fixed top-0 left-0 h-screen z-50",
          "bg-surface-container-low border-r border-outline-variant/10 py-6",
          "transition-all duration-300",
          collapsed ? "w-20" : "w-64",
        )}
      >
        {/* Brand */}
        <div className="px-6 mb-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary overflow-hidden">
            <img
              src="/img/bamboo-house-icon.png"
              className="w-full h-full object-cover"
            />
          </div>

          {!collapsed && (
            <div>
              <h1 className="font-serif italic text-xl text-primary">
                Bamboo House
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-muted">
                Restaurant System
              </p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm uppercase tracking-widest font-medium transition-all",
                  isActive
                    ? "bg-accent text-white shadow-lg shadow-primary/20"
                    : "text-on-surface/60 hover:bg-primary/10 hover:text-primary",
                )}
              >
                {item.icon}
                {!collapsed && item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-4 mt-auto">
          <Button
            onPress={handleLogout}
            variant="danger-soft"
            className="w-full uppercase tracking-widest"
          >
            <HugeiconsIcon icon={Logout02Icon} />
            {!collapsed && "Logout"}
          </Button>
        </div>
      </aside>

      {/* HEADER */}
      <header
        className={cn(
          "fixed top-0 right-0 z-40 backdrop-blur-xl bg-surface/80 border-b border-outline-variant/10",
          "flex items-center justify-between px-8 py-4",
          collapsed ? "md:left-20" : "md:left-64",
        )}
      >
        <h2 className="text-2xl font-serif italic">Dashboard</h2>

        <div className="flex items-center gap-3">
          <ToggleTheme />
          <ToggleLang />
          <Separator orientation="vertical" />
          <div className="flex items-center gap-2">
            <div>
              <Avatar size="sm" variant="soft">
                <Avatar.Image alt={user?.displayName} src={user?.avatarUrl} />
                <Avatar.Fallback color="accent">
                  <HugeiconsIcon icon={User03Icon} />
                </Avatar.Fallback>
              </Avatar>
            </div>
            <div>
              <p className="text-sm font-serif font-medium">{user?.displayName}</p>
              <p className="text-[10px] font-light">{user && user.role !== "customer" ? user.staffId : null}</p>
            </div>
            <HugeiconsIcon icon={ArrowDown01Icon} size={15} />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main
        className={cn(
          "min-h-screen pt-18 pb-12 px-6 md:px-0",
          collapsed ? "md:ml-20" : "md:ml-64",
        )}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
