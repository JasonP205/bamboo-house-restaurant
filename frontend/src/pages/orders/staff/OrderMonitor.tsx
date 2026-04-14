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
  const { loading, getAllOrdersOfBranch } = useOrderStore();
  const { t } = useTranslation(["common"]);
  const { orderOfBranch } = useOrderStore();
  const viewDetailState = useOverlayState();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const handleViewOrder = (table: Table) => {
    if (table.currentOrder) {
      setSelectedOrderId(table.currentOrder._id);
    }
    const selectedOrder = orderOfBranch?.find(
      (order) => order._id === selectedOrderId,
    );
    if (selectedOrder) {
      setSelectedOrder(selectedOrder);
      viewDetailState.open();
    } else {
      return;
    }
  };

  const gridClassName =
    "grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-3 sm:gap-4 p-3 sm:p-4 scrollbar-hidden";

  useEffect(() => {
    const init = async () => {
      if (branchId) {
        await getTableOfBranch(branchId);
        await getAllOrdersOfBranch();
      }
    };
    init();
  }, []);

  if (loadingTables || loading) {
    return (
      <div className={gridClassName}>
        <TableItemSkeleton quantity={25} />
      </div>
    );
  }
  if (!tableBranch || tableBranch.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-muted">
        <p className="text-2xl">No tables found for this branch.</p>
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
