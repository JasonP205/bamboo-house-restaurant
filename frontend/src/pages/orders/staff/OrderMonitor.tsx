import { useAuthStore } from "@/stores/useAuthStore";
import { useBranchStore } from "@/stores/useBranchStore";
import TableItemSkeleton from "@/components/order/TableItemSkeleton";
import { useEffect, useState } from "react";
import TableItem from "@/components/order/TableItem";
import Metadata from "@/components/Metadata";
import { useTranslation } from "react-i18next";
import { useOrderStore } from "@/stores/useOrderStore";
import { useOverlayState } from "@heroui/react";
import type { Order } from "@/types/order";
import type { Table } from "@/types/branch";
import OrderDetail from "@/components/order/OrderDetail";

const OrderMonitor = () => {
  const { branchId } = useAuthStore();

  const { tableBranch, getTableOfBranch, loadingTables } = useBranchStore();
  useEffect(() => {
    const init = async () => {
      if (branchId) {
        await getTableOfBranch(branchId);
      }
    };
    init();
  }, [getTableOfBranch]);
  const { loading, getAllOrdersOfBranch, orderOfBranch } = useOrderStore();

  const { t } = useTranslation(["common"]);

  const viewDetailState = useOverlayState();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const init = async () => {
      if (orderOfBranch?.length === 0 && branchId) {
        await getAllOrdersOfBranch();
      }
    };
    init();
  }, [getAllOrdersOfBranch]);

  // ✅ FIX: handle click table
  const handleViewOrder = (table: Table) => {
    if (!table.currentOrder) return;

    const orderId = table.currentOrder._id;

    const foundOrder = orderOfBranch?.find((order) => order._id === orderId);

    if (!foundOrder) {
      console.warn("Order not found in store");
      return;
    }

    setSelectedOrder(foundOrder);
    viewDetailState.open();
  };

  const gridClassName =
    "grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-3 sm:gap-4 p-3 sm:p-4 scrollbar-hidden";

  // ✅ FIX: dependency + truyền branchId
  useEffect(() => {
    if (!branchId) return;

    const init = async () => {
      await Promise.all([getTableOfBranch(branchId), getAllOrdersOfBranch()]);
    };

    init();
  }, [branchId]);

  // ⛔ loading
  if (loadingTables || loading) {
    return (
      <div className={gridClassName}>
        <TableItemSkeleton quantity={25} />
      </div>
    );
  }

  // ⛔ no tables
  if (!tableBranch || tableBranch.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-muted">
        <p className="text-2xl">{t("notifications.noTablesFoundForBranch")}</p>
      </div>
    );
  }

  return (
    <>
      <Metadata title={`${t("pageTitles.orders")} - Bamboo House`} />

      <OrderDetail state={viewDetailState} selectedOrder={selectedOrder} />

      <div className={gridClassName}>
        {tableBranch.map((table) => (
          <TableItem
            key={table._id}
            table={table}
            handleViewOrder={() => handleViewOrder(table)}
          />
        ))}
      </div>
    </>
  );
};

export default OrderMonitor;
