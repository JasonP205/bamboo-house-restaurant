import Metadata from "@/components/Metadata";
import OrderBill from "@/components/order/OrderBill";
import { formatTime } from "@/lib/helper";
import { useOrderStore } from "@/stores/useOrderStore";
import type { Order } from "@/types/order";
import { Button, Card, Modal, Skeleton, useOverlayState } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const HistoryOrder = ({ branchId }: { branchId?: string }) => {
  const { t, i18n } = useTranslation(["order"]);
  const { orderOfBranch, loading, getAllOrdersOfBranch } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const billModal = useOverlayState();

  useEffect(() => {
    getAllOrdersOfBranch(branchId);
  }, [getAllOrdersOfBranch, branchId]);

  const completedOrders = useMemo(() => {
    const items = (orderOfBranch || []).filter(
      (order) => order.status === "completed",
    );

    return items.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [orderOfBranch]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(i18n.language, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value || 0);

  const handleOpenReprint = (order: Order) => {
    setSelectedOrder(order);
    billModal.open();
  };

  return (
    <>
      <Metadata title={t("order:history.metaTitle")} />

      <Modal isOpen={billModal.isOpen} onOpenChange={billModal.setOpen}>
        <Modal.Backdrop>
          <Modal.Container size="lg">
            <Modal.Dialog>
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>{t("order:history.reprintTitle")}</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                {selectedOrder ? <OrderBill order={selectedOrder} /> : null}
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <section className="p-4 md:p-6 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif italic text-accent">
            {t("order:history.title")}
          </h1>
          <p className="text-sm text-muted mt-1">{t("order:history.description")}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : completedOrders.length === 0 ? (
          <Card className="p-8 border border-dashed border-outline text-center">
            <h2 className="text-xl font-serif italic text-accent">
              {t("order:history.emptyTitle")}
            </h2>
            <p className="text-sm text-muted mt-1">{t("order:history.emptyDescription")}</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {completedOrders.map((order) => (
              <Card key={order._id} className="p-4 border border-outline-variant/20">
                <Card.Header className="p-0 mb-3 flex flex-row items-center justify-between">
                  <div className="flex flex-col items-start gap-1">
                    <p className="text-sm text-muted">#{order.orderCode}</p>
                    <p className="text-lg font-semibold">{t("order:table")} {order.table ?? "-"}</p>
                  </div>
                  <span className="text-xs px-2 py-1 self-start rounded-full bg-success-soft text-success">
                    {t("order:status.completed")}
                  </span>
                </Card.Header>

                <Card.Content className="p-0 flex flex-col gap-2 text-sm">
                  <p>
                    <span className="font-medium">{t("order:customerName")}: </span>
                    {order.customerName?.displayName || t("order:anonymous")}
                  </p>
                  <p>
                    <span className="font-medium">{t("order:servedBy")}: </span>
                    {order.servedBy || t("order:notAssigned")}
                  </p>
                  <p>
                    <span className="font-medium">{t("order:history.completedAt")}: </span>
                    {formatTime(order.updatedAt, "full")}
                  </p>
                  <p>
                    <span className="font-medium">{t("order:totalItems")}: </span>
                    {order.dishes.reduce((sum, item) => sum + item.quantity, 0)}
                  </p>
                  <p>
                    <span className="font-medium">{t("order:total")}: </span>
                    {formatCurrency(order.totalPrice)}
                  </p>
                </Card.Content>

                <Card.Footer className="p-0 mt-4">
                  <Button className="w-full" onClick={() => handleOpenReprint(order)}>
                    {t("order:history.reprintButton")}
                  </Button>
                </Card.Footer>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default HistoryOrder;