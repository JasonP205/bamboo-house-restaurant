"use client";

import {
  Pagination,
  Table,
  Checkbox,
  Chip,
  EmptyState,
  type Selection,
  toast,
  useOverlayState,
} from "@heroui/react";
import { useMemo, useState, useEffect } from "react";
import { useBranchStore } from "@/stores/useBranchStore";
import { useTranslation } from "react-i18next";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete, PackageOutOfStockIcon } from "@hugeicons/core-free-icons";
import CreateTableModal from "../table/CreateTableModal";
import DeleteTableDialog from "./DeleteTableDialog";
interface BranchTableTabProps {
  branchId: string;
}

const BranchTableTab = ({ branchId }: BranchTableTabProps) => {
  const { t } = useTranslation(["branch"]);

  const columns = [
    { id: "number", name: t("branchDetail.tables.tableNumber") },
    { id: "capacity", name: t("branchDetail.tables.capacity") },
    { id: "isInUse", name: t("branchDetail.tables.isInUse") },
    { id: "isBooked", name: t("branchDetail.tables.isBooked") },
  ];

  const ROWS_PER_PAGE = 8;
  const { tableBranch, getTableOfBranch, deleteTable, loadingTables } =
    useBranchStore();
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [page, setPage] = useState(1);
  const deleteDialogState = useOverlayState();

  // fetch data
  useEffect(() => {
    getTableOfBranch(branchId);
  }, [branchId]);

  // pagination
  const totalPages = Math.ceil(tableBranch.length / ROWS_PER_PAGE);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return tableBranch.slice(start, start + ROWS_PER_PAGE);
  }, [page, tableBranch]);

  const start = (page - 1) * ROWS_PER_PAGE + 1;
  const end = Math.min(page * ROWS_PER_PAGE, tableBranch.length);

  const selectedIds = useMemo(() => {
    if (selectedKeys === "all") {
      return tableBranch.map((t) => t._id);
    }
    return Array.from(selectedKeys) as string[];
  }, [selectedKeys, tableBranch]);

  const deleteSelectedTables = async () => {
    if (selectedIds.length === 0) {
      toast.warning(t("branchDetail.deleteTable.toast.noSelection.title"), {
        description: t(
          "branchDetail.deleteTable.toast.noSelection.description",
        ),
        timeout: 3000,
      });
      return;
    }
    try {
      await deleteTable(branchId, selectedIds);
      deleteDialogState.close();
      setSelectedKeys(new Set());
      toast.success(
        t("branchDetail.deleteTable.toast.success.title"),
        {
          description: t("branchDetail.deleteTable.toast.success.description", {
            count: selectedIds.length,
          }),
          timeout: 3000,
        },
      );
    } catch (error) {
      toast.danger(t("branchDetail.deleteTable.toast.error.title"), {
        description: t("branchDetail.deleteTable.toast.error.description"),
        timeout: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Table variant="secondary">
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Table with selection"
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            onSelectionChange={setSelectedKeys}
          >
            {/* HEADER */}
            <Table.Header>
              <Table.Column className="pr-0">
                <Checkbox aria-label="Select all" slot="selection">
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                </Checkbox>
              </Table.Column>

              {columns.map((col) => (
                <Table.Column isRowHeader={col.id === "number"} key={col.id}>
                  {col.name}
                </Table.Column>
              ))}
            </Table.Header>

            {/* BODY */}
            <Table.Body
              renderEmptyState={() => (
                <EmptyState className="flex h-full w-full p-10 flex-col items-center justify-center text-center">
                  <HugeiconsIcon
                    icon={PackageOutOfStockIcon}
                    size={48}
                    className="text-muted"
                  />
                  <span className="text-base font-semibold text-muted">
                    {t("branchDetail.tables.emptyState.title")}
                  </span>
                  <span className="text-sm text-muted text-balance">
                    {t("branchDetail.tables.emptyState.description")}
                  </span>
                </EmptyState>
              )}
            >
              {paginatedItems.map((table) => (
                <Table.Row key={table._id} id={table._id}>
                  {/* Checkbox */}
                  <Table.Cell className="pr-0">
                    <Checkbox
                      aria-label={`Select table ${table.number}`}
                      slot="selection"
                      variant="secondary"
                    >
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                    </Checkbox>
                  </Table.Cell>

                  {/* Data */}
                  <Table.Cell>{table.number}</Table.Cell>
                  <Table.Cell>
                    {t(
                      `branchDetail.tables.data.${
                        {
                          4: "4",
                          6: "6",
                          8: "8",
                          10: "10",
                        }[table.capacity] || "10"
                      }`,
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {table.isInUse ? (
                      <Chip variant="soft" color="warning">
                        {t("branchDetail.tables.status.occupied")}
                      </Chip>
                    ) : (
                      <Chip variant="soft" color="success">
                        {t("branchDetail.tables.status.available")}
                      </Chip>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {table.isBooked ? (
                      <Chip variant="soft" color="warning">
                        {t("branchDetail.tables.status.reserved")}
                      </Chip>
                    ) : (
                      <Chip variant="soft" color="success">
                        {t("branchDetail.tables.status.available")}
                      </Chip>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>

          {/* PAGINATION */}
          <Table.Footer>
            <Pagination size="sm">
              <Pagination.Summary>
                {start} to {end} of {tableBranch.length} results
              </Pagination.Summary>

              <Pagination.Content>
                <Pagination.Item>
                  <Pagination.Previous
                    isDisabled={page === 1}
                    onPress={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <Pagination.PreviousIcon />
                    Prev
                  </Pagination.Previous>
                </Pagination.Item>

                {pages.map((p) => (
                  <Pagination.Item key={p}>
                    <Pagination.Link
                      isActive={p === page}
                      onPress={() => setPage(p)}
                    >
                      {p}
                    </Pagination.Link>
                  </Pagination.Item>
                ))}

                <Pagination.Item>
                  <Pagination.Next
                    isDisabled={page === totalPages || totalPages === 0}
                    onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                    <Pagination.NextIcon />
                  </Pagination.Next>
                </Pagination.Item>
              </Pagination.Content>
            </Pagination>
          </Table.Footer>
        </Table.ScrollContainer>
      </Table>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <DeleteTableDialog
          state={deleteDialogState}
          onDelete={deleteSelectedTables}
        />
        <CreateTableModal />
      </div>
    </div>
  );
};

export default BranchTableTab;
