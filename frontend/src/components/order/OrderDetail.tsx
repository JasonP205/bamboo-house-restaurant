import {
  Button,
  Drawer,
  Skeleton,
  useOverlayState,
} from "@heroui/react";
import { useOrderStore } from "@/stores/useOrderStore";
import type { Order } from "@/types/order";
import { useTranslation } from "react-i18next";
import AlertDialog from "../ui/AlertDialog";
import { useEffect, useState } from "react";
import OrderBill from "./OrderBill";
import { toast } from "@heroui/react";

interface OrderDetailProps {
  selectedOrder: Order | null;
  className?: string;
  state: ReturnType<typeof useOverlayState>;
}
const OrderDetail = ({ selectedOrder, state }: OrderDetailProps) => {
  const { t } = useTranslation(["order"]);
  const [hasPrintedBill, setHasPrintedBill] = useState(false);

  useEffect(() => {
    setHasPrintedBill(false);
  }, [selectedOrder?._id, selectedOrder?.status]);


  const mustPrintBeforeComplete = selectedOrder?.status === "served";
  const isCompleteBlocked = mustPrintBeforeComplete && !hasPrintedBill;
  const { revokeOrder, updateOrderStatus } = useOrderStore();

  const handleRevokeOrder = async () => {
    if (!selectedOrder) return;

    try {
      await revokeOrder(selectedOrder._id);
      state.setOpen(false);
    } catch (error) {
      console.error("Error revoking order:", error);
    }
  };

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder) return;
    if (selectedOrder.status === "served" && !hasPrintedBill) {
      toast.danger(t("order.mustPrintBill"));
      return;
    }

    try {
      await updateOrderStatus(selectedOrder._id);
      state.setOpen(false);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  return (
    <Drawer isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <button hidden></button>
      <Drawer.Backdrop>
        <Drawer.Content placement="right">
          <Drawer.Dialog>
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Heading>
                {t("order.detail.title")} - #{selectedOrder?.orderCode}
              </Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              {selectedOrder ? (
                <div className="flex flex-col gap-2">
                  <OrderBill
                    order={selectedOrder}
                    onPrinted={() => setHasPrintedBill(true)}
                  />
                </div>
              ) : (
                <Skeleton className="w-full h-4 mb-2" />
              )}
            </Drawer.Body>
            <Drawer.Footer>
              <AlertDialog
                variant="danger-soft"
                title={t("revokeOrder")}
                description={t("revokeOrderDescription")}
                onConfirm={handleRevokeOrder}
              >
                {t("revokeOrderButton")}
              </AlertDialog>
              {selectedOrder?.status === "pending" ? (
                <Button onClick={handleUpdateOrderStatus}>
                  {t("approveOrder")}
                </Button>
              ) : (
                <Button
                  onClick={handleUpdateOrderStatus}
                  isDisabled={
                    selectedOrder?.status === "completed" || isCompleteBlocked
                  }
                >
                  {t("nextStep")}
                </Button>
              )}
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
};

export default OrderDetail;
