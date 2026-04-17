import type { Order } from "@/types/order";
import { formatTime } from "@/lib/helper";
import { Button } from "@heroui/react";
import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";

interface OrderBillProps {
  order: Order;
  onPrinted?: () => void;
}

const OrderBill = ({ order, onPrinted }: OrderBillProps) => {
  const billRef = useRef<HTMLDivElement>(null);
  const { i18n, t } = useTranslation(["order"]);
  const currency = "USD";

  const totalItems = useMemo(
    () => order.dishes.reduce((sum, item) => sum + item.quantity, 0),
    [order.dishes],
  );

  const vatRate = 0.08

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(i18n.language, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value || 0);

  const handlePrint = useReactToPrint({
    contentRef: billRef,
    documentTitle: `order-${order.orderCode}`,
    
    onAfterPrint: () => {
      onPrinted?.();
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div ref={billRef} className="print-area print-80mm mx-auto w-full max-w-2xl bg-white text-black border border-gray-200 rounded-xl p-6">
        <div className="text-center border-b border-dashed border-gray-300 pb-4">
          <div className="mx-auto mb-2 h-14 w-14 overflow-hidden rounded-full border border-gray-300">
            <img
              src="/img/bamboo-house-icon.png"
              alt={t("order:bill.logoAlt")}
              className="h-full w-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold tracking-wide">{t("order:bill.brandName")}</h2>
          <p className="text-sm text-gray-600">{t("order:bill.title")}</p>
          <p className="text-xs text-gray-500 mt-1">#{order.orderCode}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm py-4 border-b border-dashed border-gray-300">
          <p>
            <span className="font-semibold">{t("order:table")}:</span> {order.table ?? "-"}
          </p>
          <p>
            <span className="font-semibold">{t(`order:status.${order.status}`)}</span>
          </p>
          <p>
            <span className="font-semibold">{t("order:timeIn")}:</span> {order.timeIn ? formatTime(order.timeIn, "full") : "-"}
          </p>
          <p>
            <span className="font-semibold">{t("order:servedBy")}:</span> {order.servedBy || t("order:notAssigned")}
          </p>
          <p className="col-span-2">
            <span className="font-semibold">{t("order:customerName")}:</span> {order.customerName?.displayName || t("order:anonymous")}
          </p>
        </div>

        <table className="w-full text-sm mt-4 table-fixed">
          <colgroup>
            <col className="w-[46%]" />
            <col className="w-[14%]" />
            <col className="w-[20%]" />
            <col className="w-[20%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-2 pr-2">{t("order:dish")}</th>
              <th className="text-right py-2 px-1">{t("order:quantity")}</th>
              <th className="text-right py-2 pl-2">{t("order:price")}</th>
              <th className="text-right py-2 pl-2">{t("order:bill.lineTotal")}</th>
            </tr>
          </thead>
          <tbody>
            {order.dishes.map((item) => {
              const dishNameVi = item.dishName.vi || item.dishName.en;
              const dishNameEn = item.dishName.en || item.dishName.vi;
              const lineTotal = item.price * item.quantity;

              return (
                <tr key={item._id} className="border-b border-gray-100 align-top">
                  <td className="py-3 pr-2">
                    <p className="font-medium capitalize">{dishNameEn}</p>
                    <p className="text-xs text-gray-500 capitalize">{dishNameVi}</p>
                    {item.note ? <p className="text-xs text-gray-500">{t("order:note")}: {item.note}</p> : null}
                  </td>
                  <td className="py-3 px-1 text-right">{item.quantity}</td>
                  <td className="py-3 pl-2 text-right whitespace-nowrap">{formatCurrency(item.price)}</td>
                  <td className="py-3 pl-2 text-right font-semibold whitespace-nowrap">{formatCurrency(lineTotal)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-4 pt-4 border-t border-dashed border-gray-300 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>{t("order:totalItems")}</span>
            <span className="font-semibold">{totalItems}</span>
          </div>
          <div className="flex justify-between">
            <span>{t("order:subtotal")}</span>
            <span className="font-semibold">{formatCurrency(order.subTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t("order:vat")} ({vatRate.toFixed(0)}%)</span>
            <span className="font-semibold">{formatCurrency(order.vatAmount)}</span>
          </div>
          <div className="flex justify-between text-base border-t border-gray-200 pt-2 mt-2">
            <span className="font-bold">{t("order:total")}</span>
            <span className="font-bold">{formatCurrency(order.totalPrice)}</span>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">{t("order:bill.thankYou")}</p>
      </div>

      <div className="flex justify-center pt-1 print:hidden">
        <Button
          onClick={handlePrint}
          variant="secondary"
          size="md"
          className="w-full max-w-2xs"
        >
          {t("order:bill.print")}
        </Button>
      </div>
    </div>
  );
};

export default OrderBill;