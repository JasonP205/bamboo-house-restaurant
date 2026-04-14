import { Drawer, Skeleton, useOverlayState } from "@heroui/react";
import { useOrderStore } from "@/stores/useOrderStore";
import { useEffect } from "react";
import type { Order } from "@/types/order";

interface OrderDetailProps {
  selectedOrder: Order | null;
  className?: string;
  state: ReturnType<typeof useOverlayState>;
}
const OrderDetail = ({ selectedOrder, className, state }: OrderDetailProps) => {
 
  return (
    <Drawer isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <button hidden></button>
      <Drawer.Backdrop>
        <Drawer.Content placement="right">
          <Drawer.Dialog>
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Heading>
                Order Detail - #{selectedOrder?.orderCode}
              </Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              {selectedOrder ? (
                <div>
                  <p>Status: {selectedOrder.status}</p>
                  <p>Total Price: ${selectedOrder.totalPrice.toFixed(2)}</p>
                  <h3>Items:</h3>
                  <ul>
                    {selectedOrder.dishes.map((item) => (
                      <li key={item._id}>
                        {item.dishName.en} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Skeleton className="w-full h-4 mb-2" />
              )}
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
};

export default OrderDetail;
