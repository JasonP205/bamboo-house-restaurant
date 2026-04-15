import { useIsMobile } from "@/hooks/useIsMobile";
import ToggleLang from "./toggleLang";
import ToggleTheme from "./toggleTheme";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Avatar, Button, Separator, Card } from "@heroui/react";
import { useAuthStore } from "@/stores/useAuthStore";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import {
  Logout02Icon,
  Store01Icon,
  TransactionHistoryIcon,
  PhoneOff01Icon,
  ServingFoodIcon,
  SpoonAndKnifeIcon,
  User03Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";
import { useSocketStore } from "@/stores/useSocketStore";

type NavItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
};

const Layout = () => {
  const { getDeviceId, deviceId, role, user, logout } = useAuthStore();
  useEffect(() => {
    if (!deviceId) {
      getDeviceId();
    }
  }, [deviceId]);
  const { connectSocketStaff, disconnectSocket } = useSocketStore();
  useEffect(() => {
    connectSocketStaff();
    return () => {
      disconnectSocket();
    };
  }, [deviceId]);
  const isMobile = useIsMobile();
  const { t } = useTranslation(["common"]);
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, _setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState<string>("");

  const staffNavItems: NavItem[] = [
    {
      name: t("staffNavItems.orders"),
      path: "/orders",
      icon: <HugeiconsIcon icon={ServingFoodIcon} size={20} />,
    },
    {
      name: t("staffNavItems.history"),
      path: "/history",
      icon: <HugeiconsIcon icon={TransactionHistoryIcon} size={20} />,
    },
  ];
  const managerNavItems: NavItem[] = [
    {
      name: t("staffNavItems.branches"),
      path: "/branches",
      icon: <HugeiconsIcon icon={Store01Icon} size={20} />,
    },
    {
      name: t("staffNavItems.menu"),
      path: "/menu",
      icon: <HugeiconsIcon icon={SpoonAndKnifeIcon} size={20} />,
    },
  ];
  const navItems = role === "manager" ? managerNavItems : staffNavItems;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const currentItem = navItems.find((item) =>
      location.pathname.includes(item.path),
    );
    if (currentItem) {
      setActivePage(currentItem.name);
    }
  }, [location.pathname, navItems]);

  /* ───────────────────────── MOBILE ───────────────────────── */
  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-2 h-screen text-center bg-background">
        <Card className="bg-danger-soft text-danger p-4 flex items-center gap-1 flex-col border border-danger/70">
          <HugeiconsIcon icon={PhoneOff01Icon} size={48} />
          <p className="text-2xl font-serif italic">Oops...!</p>
          <p className="text-sm text-balance leading relaxed">
            {t("notifications.mobileNotSupported")}
          </p>
        </Card>
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
        <h2 className="text-2xl font-serif italic capitalize">{activePage}</h2>

        <div className="flex items-center gap-3">
          <ToggleTheme />
          <ToggleLang />
          <Separator orientation="vertical" />
          {user && (
            <div className="flex items-center gap-2">
              <div>
                <Avatar size="sm" variant="soft">
                  <Avatar.Image alt={user?.displayName} src={user?.avatarUrl} />
                  <Avatar.Fallback className="text-text" color="accent">
                    <HugeiconsIcon icon={User03Icon} />
                  </Avatar.Fallback>
                </Avatar>
              </div>
              <div>
                <p className="text-sm font-serif font-medium">
                  {user?.displayName}
                </p>
                <p className="text-[10px] font-light">
                  {user.staffId ? `Staff ID: ${user.staffId}` : "No Staff ID"}
                </p>
              </div>
              <HugeiconsIcon icon={ArrowDown01Icon} size={15} />
            </div>
          )}
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
