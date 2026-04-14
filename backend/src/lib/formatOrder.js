
export const formatOrder = (order) => {
  const servedBy =
    order?.servedBy && typeof order.servedBy === "object"
      ? order.servedBy.displayName || ""
      : order?.servedBy || "";

  return {
    _id: order._id,
    orderCode: order.orderCode,
    table: order.table.number,
    branch: order.branch,
    timeIn: order.timeIn,
    servedBy,
    customerName: order.customerName || null,
    note: order.notes || "",
    deviceId: order.deviceId || null,

    dishes: order.items.map((item) => ({
      _id: item._id,
      dishName: item.dishId?.name || {
        en: "Unknown",
        vi: "Không rõ",
      },
      imageUrl: item.dishId?.imageUrl || "",
      quantity: item.quantity,
      price: item.price,
      note: item.notes || "",
    })),

    subTotal: order.subTotal,
    vatAmount: order.vatAmount,    
    totalPrice: order.totalPrice,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};