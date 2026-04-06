import { Button, toast, useOverlayState, Spinner } from "@heroui/react";
import { useState, useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignCircleIcon } from "@hugeicons/core-free-icons";
import TableFieldInfo from "./TableFieldInfo";
import { useTranslation } from "react-i18next";
import { useBranchStore } from "@/stores/useBranchStore";

export interface TableData {
  capacity?: number;
  quantity: number;
}
interface CreateTableFormProps {
  action: ReturnType<typeof useOverlayState>;
}
const CreateTableForm = ({ action }: CreateTableFormProps) => {
  const [groups, setGroups] = useState<number[]>([]);
  const [data, setData] = useState<Record<number, TableData>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const { t } = useTranslation(["branch"]);
  const { createTable, creatingTable } = useBranchStore();
  const addGroup = () => {
    const id = Date.now();
    setGroups((prev) => [...prev, id]);

    // default value
    setData((prev) => ({
      ...prev,
      [id]: {
        capacity: 4,
        quantity: 1,
      },
    }));
  };

  const removeGroup = (id: number) => {
    setGroups((prev) => prev.filter((g) => g !== id));
    setData((prev) => {
      const newData = { ...prev };
      delete newData[id];
      return newData;
    });
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const setValues = (id: number, value: Partial<TableData>) => {
    setData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...value,
      },
    }));
    setErrors((prev) => ({
      ...prev,
      [id]: "",
    }));
  };
  const validate = () => {
    const newErrors: Record<number, string> = {};

    Object.entries(data).forEach(([id, d]) => {
      if (!d.capacity) {
        newErrors[Number(id)] = t(
          "branchDetail.tables.addTable.validation.capacity",
        );
        toast.danger(t("branchDetail.tables.addTable.validation.capacity"));
      } else if (!d.quantity || d.quantity < 1) {
        newErrors[Number(id)] = t(
          "branchDetail.tables.addTable.validation.quantity",
        );
        toast.danger(t("branchDetail.tables.addTable.validation.quantity"));
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const expandData = (data: Record<number, TableData>) => {
    return Object.values(data).flatMap((d) =>
      Array.from({ length: d.quantity }, () => ({
        capacity: d.capacity!,
      })),
    );
  };

  const onSubmit = async () => {
    if (!validate()) return;

    const finalData = expandData(data);
    try {
      await createTable(finalData);
      toast.success(t("branchDetail.tables.addTable.success"));
      action.close();
    } catch (error) {
      toast.danger(t("branchDetail.tables.addTable.error"));
      console.error("Error creating tables:", error);
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [groups]);
  const hasRun = useRef(false);
  useEffect(() => {
    if (hasRun.current) return;

    hasRun.current = true;

    if (groups.length < 1) {
      addGroup();
    }
  }, []);
  return (
    <div role="form" className="flex flex-col gap-4">
      <div
        ref={containerRef}
        className="max-h-md min-h-100 max-h-135 overflow-y-auto flex rounded-md flex-col gap-4 scrollbar-hidden"
      >
        {groups.map((id) => (
          <TableFieldInfo
            key={id}
            data={data}
            id={id}
            onDelete={removeGroup}
            setValue={setValues}
            canRemove={groups.length > 1}
          />
        ))}

        <div>
          <Button
            fullWidth
            type="button"
            variant="secondary"
            className="flex items-center gap-2 justify-center"
            onClick={addGroup}
          >
            <HugeiconsIcon icon={PlusSignCircleIcon} size={18} />
            <span>Add Table</span>
          </Button>
        </div>
      </div>

      <Button
        isPending={creatingTable}
        fullWidth
        type="button"
        variant="primary"
        onClick={onSubmit}
      >
        {creatingTable ? (
          <>
            <Spinner />
            {t("branchDetail.tables.addTable.creating")}
          </>
        ) : (
          t("branchDetail.tables.addTable.submit")
        )}
      </Button>
    </div>
  );
};

export default CreateTableForm;
