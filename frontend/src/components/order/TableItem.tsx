import type { Table } from "@/types/branch";
import { QrCodeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import TableQRCodeModal from "../ui/TableQRCodeModal";
import { useAuthStore } from "@/stores/useAuthStore";

interface TableItemProps {
  table: Table;
  handleViewOrder?: () => void;
}

const TableItem = ({ table, handleViewOrder }: TableItemProps) => {
  const isOccupied = table.isInUse || table.isBooked;
  const { branchId } = useAuthStore();
  const { t } = useTranslation(["common"]);
  const getTableColor = () => {
    if (table.currentOrder?.status === "pending") {
      return "bg-warning-soft-hover text-warning border border-warning/40";
    } else if (table.currentOrder?.status === "preparing") {
      return "bg-info-soft-hover text-info border border-info/40";
    } else {
      return "bg-success-soft-hover text-success border border-success/40";
    }
  };
  return (
    <>
      <div
        onClick={handleViewOrder}
        className={`group w-full relative aspect-4/3 rounded-xl p-3 sm:p-4 bg-surface border-dashed border-2 border-muted hover:border-text/50 hover:brightness-110 transition-smooth duration-300 ${getTableColor()}`}
      >
        <div className="flex items-start justify-between gap-3">
          <span className="font-bold text-muted text-4xl sm:text-5xl leading-none">
            {table.number}
          </span>
          <TableQRCodeModal
            title={t("table.qrcodeTitle", { tableNumber: table.number })}
            tableId={table._id}
            branchId={branchId!}
          >
            <HugeiconsIcon
              icon={QrCodeIcon}
              size={24}
              className="text-muted group-hover:text-text transition-smooth duration-300"
            />
          </TableQRCodeModal>
        </div>

        <div className="absolute left-3 right-3 sm:left-4 sm:right-4 bottom-3 sm:bottom-4 flex items-end justify-between">
          <span className="text-xs sm:text-sm font-medium text-muted">
            {table.capacity} seats
          </span>
          <span
            className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
              isOccupied
                ? "bg-warning-soft-hover text-warning border border-warning/40"
                : "bg-success-soft-hover text-success border border-success/40"
            }`}
          >
            {isOccupied ? "Occupied" : "Available"}
          </span>
        </div>
      </div>
    </>
  );
};

export default TableItem;
