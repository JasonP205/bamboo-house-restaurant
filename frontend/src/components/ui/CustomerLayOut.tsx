import { Outlet, Link, useNavigate } from "react-router-dom";
import { toast } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Setting07Icon } from "@hugeicons/core-free-icons";
import { useEffect } from "react";
import { useSocketStore } from "@/stores/useSocketStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTranslation } from "react-i18next";

const CustomerLayOut = () => {
  const { getDeviceId, deviceId, role } = useAuthStore();
  const { t } = useTranslation(["common"]);
  const navigate = useNavigate();
  useEffect(() => {
    if (role === "staff" || role === "manager") {
      console.warn("Not a customer, skipping socket connection");
      toast.danger(t("invalidAccess"));
      navigate("/", { replace: true });
    }
  }, [role]);

  const { connectSocketCustomer, disconnectSocket } = useSocketStore();
  useEffect(() => {
    connectSocketCustomer();
    return () => {
      disconnectSocket();
    };
  }, [deviceId]);
  return (
    <section className="flex flex-col min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-[#f8faf3]/80 backdrop-blur-xl dark:bg-[#191c18]/80 shadow-none">
        <div className="flex items-center justify-between px-6 h-16 w-full">
          <Link to="/">
            <img
              src="/img/bamboo-house-icon.png"
              className="w-10 h-10 object-cover rounded-lg"
            />
          </Link>
          <h1 className="font-['Playfair_Display'] text-2xl tracking-tight dark:text-white font-bold text-emerald-900 dark:text-emerald-100">
            Bamboo House
          </h1>
          <button className="active:scale-95 transition-transform duration-200 hover:opacity-80 transition-opacity relative">
            <HugeiconsIcon icon={Setting07Icon} />
          </button>
        </div>
      </header>
      <div className="pt-20 flex-1">
        <Outlet />
      </div>
    </section>
  );
};

export default CustomerLayOut;
