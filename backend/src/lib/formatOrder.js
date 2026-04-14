
export const formatOrder = (order) => {
  return {
    _id: order._id,
    orderCode: order.orderCode,
    table: order.table.number,
    branch: order.branch,
    timeIn: order.timeIn,
    servedBy: order.servedBy,
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

    discount: order.discount || 0,
    totalPrice: order.totalPrice,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};