import {
  Button,
  Table,
  Pagination,
  Checkbox,
  EmptyState,
  Avatar,
  type Selection,
  Tooltip,
  toast,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useBranchStore } from "@/stores/useBranchStore";
import { useEffect, useMemo, useState } from "react";
import AddStaffDialog from "./AddStaffDialog";
import { LinkSquare02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

const StaffTab = () => {
  const { t } = useTranslation(["branch"]);
  const {
    staffs,
    getStaffsOfBranch,
    loadingFetchStaffs,
    deleteStaff,
    loadingStaffAction,
  } = useBranchStore();

  useEffect(() => {
    const init = async () => {
      await getStaffsOfBranch();
    };
    init();
  }, []);

  const columns = [
    { id: "staffId", name: "Staff ID" },
    { id: "avatar", name: t("staffTab.table.avatar") },
    { id: "displayName", name: t("staffTab.table.name") },
    { id: "email", name: t("staffTab.table.email") },
    { id: "dateOfJoining", name: t("staffTab.table.dateOfJoined") },
    { id: "gender", name: t("staffTab.table.gender") },
    { id: "action", name: t("staffTab.table.action") },
  ];

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [page, setPage] = useState(1);

  const ROWS_PER_PAGE = 5;

  // pagination
  const totalPages = Math.ceil(staffs.length / ROWS_PER_PAGE);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return staffs.slice(start, start + ROWS_PER_PAGE);
  }, [page, staffs]);

  const start = (page - 1) * ROWS_PER_PAGE + 1;
  const end = Math.min(page * ROWS_PER_PAGE, staffs.length);

  // selection
  const selectedIds = useMemo(() => {
    if (selectedKeys === "all") {
      return staffs.map((s) => s._id);
    }
    return Array.from(selectedKeys) as string[];
  }, [selectedKeys, staffs]);

  const isDeletingStaff = Boolean(loadingStaffAction.delete);

  const copyClicked = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`Copied to clipboard: ${value}`, {
      timeout: 2000,
    });
  };

  const deleteSelectedStaffs = async () => {
    if (selectedIds.length === 0) {
      toast.warning(t("staffTab.deleteStaff.toast.noSelection.title"), {
        description: t("staffTab.deleteStaff.toast.noSelection.description"),
        timeout: 3000,
      });
      return;
    }

    try {
      await deleteStaff(selectedIds);
      setSelectedKeys(new Set());
      setPage(1);
      toast.success(t("staffTab.deleteStaff.toast.success.title"), {
        description: t("staffTab.deleteStaff.toast.success.description", {
          count: selectedIds.length,
        }),
        timeout: 3000,
      });
    } catch (error) {
      toast.danger(t("staffTab.deleteStaff.toast.error.title"), {
        description: t("staffTab.deleteStaff.toast.error.description"),
        timeout: 3000,
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {loadingFetchStaffs ? (
        <div className="w-full h-40 flex items-center justify-center">
          <span className="text-muted">{t("staffTab.loading")}</span>
        </div>
      ) : (
        <Table variant="secondary">
          <Table.ScrollContainer>
            <Table.Content
              selectedKeys={selectedKeys}
              selectionMode="multiple"
              aria-label="Staff Table"
              onSelectionChange={setSelectedKeys}
            >
              {/* HEADER */}
              <Table.Header>
                <Table.Column className="pr-0">
                  <Checkbox slot="selection">
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                  </Checkbox>
                </Table.Column>

                {columns.map((col) => (
                  <Table.Column
                    isRowHeader={col.id === "displayName"}
                    key={col.id}
                  >
                    {col.name}
                  </Table.Column>
                ))}
              </Table.Header>

              {/* BODY */}
              <Table.Body
                renderEmptyState={() => (
                  <EmptyState className="p-10 text-center">
                    <span className="text-base font-semibold">
                      No staff found
                    </span>
                  </EmptyState>
                )}
              >
                {paginatedItems.map((staff) => (
                  <Table.Row key={staff._id} id={staff._id}>
                    {/* Checkbox */}
                    <Table.Cell className="pr-0">
                      <Checkbox slot="selection">
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                      </Checkbox>
                    </Table.Cell>

                    {/* Staff ID */}
                    <Table.Cell onClick={() => copyClicked(staff.staffId)}>
                      {staff.staffId}
                    </Table.Cell>

                    {/* Avatar */}
                    <Table.Cell>
                      <Avatar size="lg">
                        <Avatar.Image
                          src={staff.avatarUrl}
                          alt={staff.displayName}
                          className="object-cover"
                        />
                        <Avatar.Fallback>
                          {staff.displayName?.charAt(0)?.toUpperCase() || "?"}
                        </Avatar.Fallback>
                      </Avatar>
                    </Table.Cell>

                    {/* Name */}
                    <Table.Cell>{staff.displayName}</Table.Cell>

                    {/* Email (nếu có) */}
                    <Table.Cell>
                      {"email" in staff ? (staff as any).email : "-"}
                    </Table.Cell>

                    {/* Date */}
                    <Table.Cell>
                      {staff.dateOfJoining
                        ? new Date(staff.dateOfJoining!).toLocaleDateString()
                        : "-"}
                    </Table.Cell>

                    {/* Gender */}
                    <Table.Cell className="capitalize">
                      {staff.gender}
                    </Table.Cell>

                    {/* Action */}
                    <Table.Cell>
                      <Tooltip>
                        <Link
                          to={`/staff/${staff._id}`}
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <HugeiconsIcon size={15} icon={LinkSquare02Icon} />
                        </Link>
                        <Tooltip.Content>
                          <p>{t("staffTab.table.viewProfile")}</p>
                        </Tooltip.Content>
                      </Tooltip>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>

            {/* PAGINATION */}
            <Table.Footer>
              <Pagination size="sm">
                <Pagination.Summary>
                  {start} to {end} of {staffs.length} results
                </Pagination.Summary>

                <Pagination.Content>
                  <Pagination.Item>
                    <Pagination.Previous
                      isDisabled={page === 1}
                      onPress={() => setPage((p) => Math.max(1, p - 1))}
                    >
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
                      onPress={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      Next
                    </Pagination.Next>
                  </Pagination.Item>
                </Pagination.Content>
              </Pagination>
            </Table.Footer>
          </Table.ScrollContainer>
        </Table>
      )}

      {/* ACTION */}
      <div className="w-full flex flex-col md:flex-row gap-4">
        <Button
          fullWidth
          variant="danger-soft"
          className="flex-1"
          isDisabled={selectedIds.length === 0 || isDeletingStaff}
          isPending={isDeletingStaff}
          onPress={deleteSelectedStaffs}
        >
          {isDeletingStaff
            ? t("branch:staffTab.deleteStaff.processing")
            : t("branch:staffTab.deleteStaffButton")}
        </Button>
        <AddStaffDialog className="flex-1">
          <Button fullWidth variant="primary">
            {t("branch:staffTab.addStaffButton")}
          </Button>
        </AddStaffDialog>
      </div>
    </div>
  );
};

export default StaffTab;
