import { useIsMobile } from "@/hooks/useIsMobile";
import ToggleLang from "./toggleLang";
import ToggleTheme from "./toggleTheme";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Tooltip, Separator, Drawer } from "@heroui/react";
import { useAuthStore } from "@/stores/useAuthStore";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Logout02Icon,
  Store01Icon,
  UserGroupIcon,
  ServingFoodIcon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
type NavItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
};

/* ─────────────────────────────────────────
   SideNavLink — single nav item for sidebar
───────────────────────────────────────── */
const SideNavLink = ({
  item,
  collapsed,
  isActive,
  onClick,
}: {
  item: NavItem;
  collapsed: boolean;
  isActive: boolean;
  onClick?: () => void;
}) => {
  const linkEl = (
    <Link
      to={item.path}
      onClick={onClick}
      className={[
        "flex items-center gap-3 rounded-xl transition-all duration-200 select-none outline-none",
        "focus-visible:ring-2 focus-visible:ring-[var(--focus)]",
        collapsed ? "justify-center p-2.5" : "px-3 py-2.5",
        isActive
          ? "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-sm font-semibold"
          : "text-[var(--muted)] hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground)]",
      ]
        .join(" ")
        .trim()}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="flex-shrink-0">{item.icon}</span>
      {!collapsed && (
        <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
          {item.name}
        </span>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip.Root delay={300}>
        <Tooltip.Trigger>{linkEl}</Tooltip.Trigger>
        <Tooltip.Content placement="right">{item.name}</Tooltip.Content>
      </Tooltip.Root>
    );
  }

  return linkEl;
};

/* ─────────────────────────────────────────
   Main Layout component
───────────────────────────────────────── */
const Layout = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation(["common"]);
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
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

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  /* ──────────────────────────────────────
     MOBILE LAYOUT
  ────────────────────────────────────── */
  if (isMobile) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-background">

        {/* ── Mobile Header ── */}
        <header className="h-14 z-40 fixed top-0 left-0 right-0 flex items-center justify-between px-4 bg-surface border-b border-border">
          <div className="flex items-center gap-2.5">
            <img
              src="/bamboo-house-icon.png"
              alt="Bamboo House Logo"
              className="size-9 rounded-lg object-cover"
            />
            <span
              className="text-[15px] font-bold text-accent tracking-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Bamboo House
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            isIconOnly
            aria-label="Toggle navigation menu"
            onPress={() => setMobileMenuOpen((v) => !v)}
          >
            <HugeiconsIcon icon={Menu01Icon} size={20} />
          </Button>
        </header>

        {/* ── Mobile Slide-in Drawer ── */}
        <Drawer.Backdrop
          isOpen={mobileMenuOpen}
          onOpenChange={setMobileMenuOpen}
          variant="blur"
        >
          <Drawer.Content placement="left" className="w-64 max-w-[85vw] ">
            <Drawer.Dialog className="h-full bg-surface p-0 border-r border-border flex flex-col shadow-2xl">
              {/* Brand */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                <img
                  src="/bamboo-house-icon.png"
                  alt="Logo"
                  className="size-10 rounded-lg object-cover"
                />
                <div>
                  <p
                    className="text-base font-bold text-accent leading-tight"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Bamboo House
                  </p>
                  <p className="text-[11px] text-muted mt-0.5">
                    Restaurant System
                  </p>
                </div>
              </div>

              {/* Section label */}
              <p className="px-5 pt-4 pb-1 text-[10px] font-semibold tracking-widest uppercase text-muted">
                Quản lý
              </p>

              {/* Nav items */}
              <nav className="flex flex-col gap-1 flex-1 px-3 pb-4 overflow-y-auto">
                {navItems.map((item) => (
                  <SideNavLink
                    key={item.path}
                    item={item}
                    collapsed={false}
                    isActive={location.pathname === item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  />
                ))}
              </nav>

              <div className="px-3 pb-5 flex flex-col gap-3">
                {/* ── Preferences row ── */}
                <Separator />
                <div className="flex items-center justify-between gap-2">
                  <ToggleTheme />
                  <ToggleLang compact />
                </div>
                <Separator />
                <Button
                  fullWidth
                  variant="danger"
                  size="sm"
                  className="font-semibold gap-2"
                  onPress={handleLogout}
                >
                  <HugeiconsIcon
                    icon={Logout02Icon}
                    className="rotate-180"
                    size={18}
                  />
                  {t("staffNavItems.logoutButton")}
                </Button>
              </div>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>

        {/* ── Main Content ── */}
        <main className="flex-1 pt-14 pb-16 overflow-auto bg-background">
          <div className="p-4">
            <Outlet />
          </div>
        </main>

        {/* ── Mobile Bottom Nav ── */}
        <nav className="h-16 z-40 fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex items-center justify-around px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={[
                  "flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-accent"
                    : "text-muted hover:text-foreground",
                ].join(" ")}
              >
                <span
                  className={[
                    "p-1.5 rounded-lg transition-all",
                    isActive ? "bg-surface-secondary" : "",
                  ].join(" ")}
                >
                  {item.icon}
                </span>
                <span className="text-[10px] font-medium leading-none">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    );
  }

  /* ──────────────────────────────────────
     DESKTOP LAYOUT
  ────────────────────────────────────── */
  return (
    <div className="w-full h-screen flex flex-col bg-background">

      {/* ── Desktop Header ── */}
      <header className="h-16 z-30 shrink-0 flex items-center justify-between px-5 bg-surface border-b border-border">
        {/* Left: hamburger + brand */}
        <div className="flex items-center gap-3">
          <Tooltip.Root delay={500}>
            <Tooltip.Trigger>
              <Button
                variant="ghost"
                size="sm"
                isIconOnly
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                onPress={() => setCollapsed((v) => !v)}
              >
                <HugeiconsIcon icon={Menu01Icon} size={20} />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content placement="bottom">
              {collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
            </Tooltip.Content>
          </Tooltip.Root>

          <div className="flex items-center gap-2.5">
            <img
              src="/bamboo-house-icon.png"
              alt="Bamboo House Logo"
              className="size-9 rounded-lg object-cover shadow-sm"
            />
            {!collapsed && (
              <div className="leading-none">
                <p
                  className="text-[15px] font-bold text-accent"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Bamboo House
                </p>
                <p className="text-[11px] text-muted mt-0.5">
                  Restaurant Management
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-2">
          <ToggleTheme />
          <ToggleLang />
        </div>
      </header>

      {/* ── Body: Sidebar + Main ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ── Sidebar ── */}
        <aside
          className={[
            "shrink-0 flex flex-col bg-surface border-r border-border",
            "transition-[width] duration-250 ease-in-out overflow-hidden",
            collapsed ? "w-18" : "w-60",
          ].join(" ")}
        >
          {/* Nav items */}
          <nav
            className={[
              "flex flex-col gap-1 flex-1 py-4 overflow-y-auto overflow-x-hidden",
              collapsed ? "px-2" : "px-3",
            ].join(" ")}
          >
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest uppercase text-muted">
                Quản lý
              </p>
            )}

            {navItems.map((item) => (
              <SideNavLink
                key={item.path}
                item={item}
                collapsed={collapsed}
                isActive={location.pathname === item.path}
              />
            ))}
          </nav>

          {/* Logout area */}
          <div className={["pb-4", collapsed ? "px-2" : "px-3"].join(" ")}>
            <Separator className="mb-3" />

            {collapsed ? (
              <Tooltip.Root delay={300}>
                <Tooltip.Trigger>
                  <Button
                    variant="ghost"
                    size="sm"
                    isIconOnly
                    aria-label="Logout"
                    className="w-full text-danger hover:bg-[color-mix(in_oklch,var(--danger)_10%,transparent)]"
                    onPress={handleLogout}
                  >
                    <HugeiconsIcon
                      icon={Logout02Icon}
                      className="rotate-180"
                      size={20}
                    />
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content placement="right">
                  {t("staffNavItems.logoutButton")}
                </Tooltip.Content>
              </Tooltip.Root>
            ) : (
              <Button
                fullWidth
                variant="danger"
                size="sm"
                className="font-semibold gap-2"
                onPress={handleLogout}
              >
                <HugeiconsIcon
                  icon={Logout02Icon}
                  className="rotate-180"
                  size={18}
                />
                {t("staffNavItems.logoutButton")}
              </Button>
            )}
          </div>
        </aside>

        {/* ── Main content area ── */}
        <main className="flex-1 min-w-0 overflow-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
