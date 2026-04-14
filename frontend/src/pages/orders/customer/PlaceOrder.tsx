import { useParams, useSearchParams } from "react-router-dom";
import { useBranchStore } from "@/stores/useBranchStore";
import { useMenuStore } from "@/stores/useMenuStore";
import { useOrderStore } from "@/stores/useOrderStore";
import { useEffect, useMemo, useState } from "react";
import { ArrowUp03Icon, ShoppingCart02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import DishUI from "@/components/order/DishUI";
import { Button } from "@heroui/react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import ViewOrderDetail from "@/components/order/ViewOrderDetail";
import { useSocketStore } from "@/stores/useSocketStore";
import { useAuthStore } from "@/stores/useAuthStore";

const PlaceOrder = () => {
  const [searchParams] = useSearchParams();
  const branchId = searchParams.get("b") || "";
  const tableId = searchParams.get("t") || "";
  const { t } = useTranslation(["dishes"]);

  const { menu, loadingFetchDishes, getMenu } = useMenuStore();
  const { branches, fetchBranches, loading } = useBranchStore();
  const {
    setCurrentBranchId,
    currentBranchId,
    cart,
    sendOrder,
    loadingOrderSubmit,
  } = useOrderStore();
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "appetizer" | "main" | "beverage" | "merchandise"
  >("all");

  const { deviceId } = useAuthStore();
  const { connectSocketCustomer, disconnectSocket } = useSocketStore();

  const filteredMenu = useMemo(() => {
    return menu.filter(
      (dish) =>
        dish.category === selectedCategory || selectedCategory === "all" && dish.isAvailable,
    );
  }, [menu, branchId, selectedCategory]);

  if (!branchId || !tableId) {
    return <div>Invalid branch or table ID</div>;
  }
  useEffect(() => {
    const init = async () => {
      if (!branches.length) await fetchBranches();
    };
    init();
  }, [branches.length]);

  useEffect(() => {
    useOrderStore.getState().setCurrentTableId(tableId);
  }, [tableId]);

  useEffect(() => {
    if (!menu.length) getMenu();
  }, [menu.length]);

  const branch = useMemo(() => {
    return branches.find((b) => b._id === branchId);
  }, [branches, branchId]);
  useEffect(() => {
    if (branch?._id && branch._id !== currentBranchId) {
      setCurrentBranchId(branch._id);
    }
  }, [branch?._id]);
  useEffect(() => {
    connectSocketCustomer(tableId);
    return () => {
      disconnectSocket();
    };
  }, [deviceId]);

  if (loading || loadingFetchDishes) {
    return <div>Loading...</div>;
  }

  if (!branch) {
    return <div>Branch not found</div>;
  }

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce(
    (total, item) => total + item.quantity * item.price,
    0,
  );

  return (
    <div className="p-2 relative flex flex-col gap-4 h-full">
      <div>
        <h1 className="font-serif flex-col text-2xl italic text-accent flex gap-1 items-start">
          <span className="font-light">Order for </span>
          <span className="capitalize">{branch.name}</span>
        </h1>

        <p className="text-xs text-muted leading-relaxed text-balance">
          Select dishes from the menu and place your order. Then we will prepare
          your food and deliver it to you as soon as possible.
        </p>
      </div>
      <nav className="mb-6">
        <ul className="flex gap-2 relative">
          {[
            { label: t("dish.category.all"), value: "all" },
            { label: t("dish.category.appetizer"), value: "appetizer" },
            { label: t("dish.category.main"), value: "main" },
            { label: t("dish.category.beverage"), value: "beverage" },
            { label: t("dish.category.merchandise"), value: "merchandise" },
          ].map((category) => {
            const isActive = selectedCategory === category.value;

            return (
              <li
                key={category.value}
                onClick={() => setSelectedCategory(category.value as any)}
                className="relative cursor-pointer font-serif italic text-sm font-medium capitalize tracking-wider"
              >
                <span
                  className={`transition-smooth duration-300 ${isActive ? "text-accent" : "text-muted hover:text-accent"}`}
                >
                  {category.label}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="underline"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                    className="absolute left-0 right-0 -bottom-2 h-0.5 bg-accent rounded"
                  />
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="space-y-4 max-h-full overflow-y-auto pb-20">
        {filteredMenu.map((dish) => (
          <DishUI key={dish._id} dish={dish} />
        ))}
      </div>
      <ViewOrderDetail
        tableId={tableId}
        branchId={branchId}
        className="fixed bottom-2 items-center gap-2 left-1/2 p-2 flex -translate-x-1/2 w-[95%] bg-accent rounded-xl shadow-lg"
      >
        <div className="bg-surface/20 shink-0 w-12 aspect-square flex items-center justify-center rounded-full text-white text-2xl font-bold">
          <HugeiconsIcon strokeWidth={2} size={26} icon={ShoppingCart02Icon} />
        </div>
        <div>
          <p className="text-white font-serif font-medium">Current Order</p>
          <p className="text-white font-semibold text-sm">
            {totalItems} items - ${totalPrice.toFixed(2)}
          </p>
        </div>
        <div className="ml-auto bg-warning text-white rounded-xl px-2 py-1 flex items-center justify-center">
          {t("order.preview")}
        </div>
      </ViewOrderDetail>
    </div>
  );
};

export default PlaceOrder;
