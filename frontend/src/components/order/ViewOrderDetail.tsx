import { useOrderStore } from "@/stores/useOrderStore";
import {
  Drawer,
  ScrollShadow,
  TextField,
  InputGroup,
  Label,
  Button,
  Separator,
  toast,
} from "@heroui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MinusSignIcon,
  PlusSignIcon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface ViewOrderDetailProps {
  children?: React.ReactNode;
  className?: string;
  tableId: string;
  branchId: string;
}

const ViewOrderDetail = ({ children, className, tableId, branchId }: ViewOrderDetailProps) => {
  const { t } = useTranslation(["order"]);
  const { i18n } = useTranslation();
  const { cart, sendOrder, loadingOrderSubmit, removeFromCart, order } =
    useOrderStore();
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce(
    (total, item) => total + item.dish.price * item.quantity,
    0,
  );
  const handleSendOrder = async () => {
    try {
      await sendOrder(branchId, tableId);
      toast.success(t("order.sendSuccess"));
    } catch (error) {
      console.error("Error sending order:", error);
    }
  };
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
              {cart.length === 0 ? (
                <div className="text-center text-muted py-10">
                  {t("orderEmpty")}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {
                    order && order.dishes.map((item) => (
                      <div
                      key={item.dishName[i18n.language as "en" | "vi"]}
                      className="flex gap-4 items-center justify-between"
                    >
                      <span className="font-medium capitalize">
                        {item.dishName[i18n.language as "en" | "vi"]} * {item.quantity}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    ))
                  }
                  {cart.map((cartItem) => (
                    <div
                      key={cartItem.dish._id}
                      className="flex gap-4 items-center justify-between"
                    >
                      <span className="font-medium capitalize">
                        {cartItem.dish.name[i18n.language as "en" | "vi"]} * {cartItem.quantity}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted">
                          ${(cartItem.price * cartItem.quantity).toFixed(2)}
                        </span>
                        <div className="ml-auto flex items-center gap-2">
                          <Button
                            variant="danger-soft"
                            isIconOnly
                            size="sm"
                            onClick={() => removeFromCart(cartItem.dish._id)}
                          >
                            <HugeiconsIcon size={12} icon={Delete02Icon} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Drawer.Body>
            <Drawer.Footer>
              <div className="w-full flex flex-col gap-4">
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t("order.total")}</span>
                  <span className="text-lg font-bold">{totalItems}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t("order.total")}</span>
                  <span className="text-lg font-bold">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <Button
                  isDisabled={cart.length === 0 || loadingOrderSubmit}
                  className="w-full bg-accent text-white rounded-xl"
                  onClick={handleSendOrder}
                >
                  {t("order.sendOrder")}
                </Button>
              </div>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
};

export default ViewOrderDetail;
