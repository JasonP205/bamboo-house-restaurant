import {
  Alert,
  Button,
  Drawer,
  Separator,
  Skeleton,
  useOverlayState,
} from "@heroui/react";
import { useOrderStore } from "@/stores/useOrderStore";
import { useEffect } from "react";
import type { Order } from "@/types/order";
import { useTranslation } from "react-i18next";
import AlertDialog from "../ui/AlertDialog";
import { formatTime } from "@/lib/helper";

interface OrderDetailProps {
  selectedOrder: Order | null;
  className?: string;
  state: ReturnType<typeof useOverlayState>;
}
const OrderDetail = ({ selectedOrder, className, state }: OrderDetailProps) => {
  const { t } = useTranslation(["order"]);
  const { i18n } = useTranslation();
  const statusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning-soft-hover text-warning border border-warning/40 w-full p-4 rounded-lg animate-pulse";
      case "in-progress":
        return "bg-info-soft-hover text-info border border-info/40 w-full p-4 rounded-lg animate-pulse";
      case "served":
        return "bg-success-soft-hover text-success border border-success/40 w-full p-4 rounded-lg animate-pulse";
      default:
        return "bg-muted-soft-hover text-muted border border-muted/40 w-full p-4 rounded-lg animate-pulse";
    }
  };
  const { revokeOrder } = useOrderStore();

  const handleRevokeOrder = async () => {
    if (!selectedOrder) return;

    try {
      await revokeOrder(selectedOrder._id);
      state.setOpen(false);
    } catch (error) {
      console.error("Error revoking order:", error);
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
                  <div className={statusStyle(selectedOrder.status)}>
                    {t(`order.status.${selectedOrder.status}`)}
                  </div>
                  <p>
                    {t("order.servedBy")}:{" "}
                    {selectedOrder?.servedBy || t("order.notAssigned")}
                  </p>
                  <p>
                    {t("order.customerName")}:{" "}
                    {selectedOrder?.customerName?.displayName ||
                      t("order.anonymous")}
                  </p>
                  <p>
                    {t("order.table")}:{" "}
                    {selectedOrder?.table || t("order.noTable")}
                  </p>
                  <p>
                    {t("order.timeIn")}:{" "}
                    {formatTime(selectedOrder?.timeIn!, "time")}
                  </p>
                  <p>
                    {t("order.CreateAt")}:{" "}
                    {formatTime(selectedOrder?.createdAt!, "date")}
                  </p>
                  <Separator className="my-4" />
                  <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
                        <tr>
                          <th className="text-left px-4 py-3">
                            {t("order.dish")}
                          </th>
                          <th className="text-right px-4 py-3">
                            {t("order.quantity")}
                          </th>
                          <th className="text-right px-4 py-3">
                            {t("order.price")}
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y">
                        {selectedOrder.dishes.map((item, index) => {
                          const lang = i18n.language as "en" | "vi";
                          const total = item.price * item.quantity;

                          return (
                            <tr
                              key={index}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              {/* Dish */}
                              <td className="px-4 py-3 font-medium capitalize text-gray-800">
                                {item.dishName[lang] || item.dishName.en}
                                {item.note && (
                                  <p className="text-xs text-muted mt-1">
                                    {t("order.note")}: {item.note}
                                  </p>
                                )}
                              </td>

                              {/* Quantity */}
                              <td className="px-4 py-3 text-right text-gray-600">
                                ×{item.quantity}
                              </td>

                              {/* Price */}
                              <td className="px-4 py-3 text-right font-semibold text-green-600">
                                {new Intl.NumberFormat(i18n.language, {
                                  style: "currency",
                                  currency: lang === "vi" ? "VND" : "USD",
                                }).format(total)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex flex-col w-full justify-end">
                    <span className="text-sm font-semibold self-end text-muted">
                      {t("order.totalItems")}:{" "}
                      {selectedOrder.dishes.reduce(
                        (acc, item) => acc + item.quantity,
                        0,
                      )}
                    </span>
                    <span className="text-sm self-end font-semibold text-muted">
                      {t("order.total")}:{" "}
                      {new Intl.NumberFormat(i18n.language, {
                        style: "currency",
                        currency: "usd",
                      }).format(selectedOrder.totalPrice)}
                    </span>
                  </div>
                </div>
              ) : (
                <Skeleton className="w-full h-4 mb-2" />
              )}
            </Drawer.Body>
            <Drawer.Footer>
              <AlertDialog
                variant="danger-soft"
                title={t("order.revokeOrder")}
                description={t("order.revokeOrderDescription")}
                onConfirm={handleRevokeOrder}
              >
                {t("order.revokeOrder")}
              </AlertDialog>
              {selectedOrder?.status === "pending" ? (
                <Button>{t("order.approveOrder")}</Button>
              ) : (
                <Button>{t("order.nextStep")}</Button>
              )}
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
};

export default OrderDetail;
