import { useOrderStore } from "@/stores/useOrderStore";
import { Drawer, Button, Separator, toast, Description } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface ViewOrderDetailProps {
  children?: React.ReactNode;
  className?: string;
  tableId: string;
  branchId: string;
}

const ViewOrderDetail = ({
  children,
  className,
  tableId,
  branchId,
}: ViewOrderDetailProps) => {
  const { t } = useTranslation(["order"]);
  const { i18n } = useTranslation();
  const {
    cart,
    sendOrder,
    loadingOrderSubmit,
    removeFromCart,
    order,
    updateOrderItem,
  } = useOrderStore();

  const handleSendOrder = async () => {
    try {
      await sendOrder(branchId, tableId);
      toast.success(t("order.sendSuccess"));
    } catch (error) {
      console.error("Error sending order:", error);
      const message =
        error instanceof Error ? error.message : t("order.sendFailed");
      toast(message, { variant: "danger" });
    }
  };
  const handleUpdateOrderItem = async () => {
    try {
      await updateOrderItem(branchId, tableId);
      toast.success(t("order.updateSuccess"));
    } catch (error) {
      console.error("Error updating order item:", error);
      toast.danger(t("order.updateFailed"));
    }
  };
  const lang = i18n.language.split("-")[0] as "en" | "vi";

  const orderItems =
    order?.dishes?.map((item) => ({
      id: item._id || item.dishName.en, // fallback
      name: item.dishName[lang] || item.dishName.en,
      quantity: item.quantity,
      price: item.price,
      note: item.note,
      isCart: false,
    })) || [];

  const cartItems = cart.map((cartItem) => ({
    id: cartItem.dish._id,
    name: cartItem.dish.name[lang] || cartItem.dish.name.en,
    quantity: cartItem.quantity,
    price: cartItem.price,
    note: cartItem.note,
    isCart: true,
  }));
  const items = [...orderItems, ...cartItems];
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const vat_percentage = parseFloat(import.meta.env.VITE_VAT_PERCENTAGE || "0");
  const vat_amount = subtotalPrice * vat_percentage;
  const totalPrice = subtotalPrice + vat_amount;

  console.log("Order items:", items);
  return (
    <Drawer>
      <Drawer.Trigger className={className}>{children}</Drawer.Trigger>
      <Drawer.Backdrop>
        <Drawer.Content placement="bottom">
          <Drawer.Dialog>
            <Drawer.Handle />
            <Drawer.Header>
              <Drawer.Heading>{t("order.yourOrder")}</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body className="scrollbar-hidden">
              {items.length === 0 ? (
                <div className="text-center text-muted py-10">
                  {t("orderEmpty")}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <span className="capitalize">
                        <p className="text-accent font-semibold font-serif">
                          {item.name} × {item.quantity}
                        </p>
                        {item.note && (
                          <Description className="line-clamp-2 italic">
                            {item.note}
                          </Description>
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                        {item.isCart && (
                          <Button
                            variant="danger-soft"
                            isIconOnly
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <HugeiconsIcon size={12} icon={Delete02Icon} />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Drawer.Body>
            <Separator className="my-4" />
            <Drawer.Footer>
              <div className="w-full flex flex-col gap-4">
                <div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">{t("order.totalItems")}</span>
                    <span className="text-sm font-semibold">{totalItems}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">{t("order.subtotal")}</span>
                    <span className="text-sm font-semibold">
                      ${subtotalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">{t("order.vat")}</span>
                    <span className="text-xs italic">
                      ${vat_amount.toFixed(2)} (
                      {(vat_percentage * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">{t("order.total")}</span>
                    <span className="text-sm font-semibold">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
                {order ? (
                  <Button
                    onClick={handleUpdateOrderItem}
                    isPending={loadingOrderSubmit}
                    className="w-full"
                  >
                    {t("order.updateOrder")}
                  </Button>
                ) : (
                  <Button
                    onClick={handleSendOrder}
                    isPending={loadingOrderSubmit}
                    className="w-full"
                  >
                    {t("order.sendOrder")}
                  </Button>
                )}
              </div>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
};

export default ViewOrderDetail;
