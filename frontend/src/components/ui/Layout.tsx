import { useIsMobile } from "@/hooks/useIsMobile";
import ToggleLang from "./toggleLang";
import ToggleTheme from "./toggleTheme";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@heroui/react";
import { useAuthStore } from "@/stores/useAuthStore";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Logout02Icon,
  Store01Icon,
  Table02Icon,
  UserGroupIcon,
  ServingFoodIcon,
} from "@hugeicons/core-free-icons";

const Layout = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation(["common"]);
  const { role, logout } = useAuthStore();

  const staffNavTools = [
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
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  if (isMobile) {
    return (
      <div className="w-full min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-14 z-40 border-b fixed top-0 left-0 right-0 flex items-center px-4 bg-surface">Header</header>

        {/* Main */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>

        {/* Bottom Nav */}
        <div className="h-16 fixed bottom-0 left-0 right-0 border-t flex items-center justify-around bg-surface">
          Mobile Navigation
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen grid grid-rows-[64px_1fr] grid-cols-[250px_1fr]">
      {/* Header (full width) */}
      <header className="col-span-2 justify-between bg-background border-b flex items-center px-4">
        <div className="justify-between flex items-center">
          <img
            src="/bamboo-house-icon.png"
            alt="Logo"
            className="size-12 mr-2 rounded-md"
          />
          <span className="text-lg font-semibold text-accent">
            Bamboo House
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <ToggleTheme />
          <ToggleLang />
        </div>
      </header>

      {/* Sidebar */}
      <div className="border-r p-4">
        <nav className="flex flex-col h-full space-y-2">
          {staffNavTools.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                to={item.path}
                key={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group
          ${
            isActive
              ? "bg-surface-secondary text-accent font-medium"
              : "text-muted hover:bg-surface-secondary hover:text-accent"
          }`}
              >
                {item.icon && <span className="mr-3">{item.icon}</span>}

                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}

          <div className="mt-auto pt-4">
            <Button
              fullWidth
              variant="danger"
              className="text-white flex items-center justify-center gap-2 py-3"
              onClick={handleLogout}
            >
              <HugeiconsIcon
                icon={Logout02Icon}
                className="rotate-180"
                size={22}
              />
              <span className="font-semibold">
                {t("staffNavItems.logoutButton")}
              </span>
            </Button>
          </div>
        </nav>
      </div>

      {/* Main */}
      <main className="p-4 flex justify-center items-center">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
