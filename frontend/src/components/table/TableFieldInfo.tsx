import {
  CloseButton,
  Select,
  Card,
  Label,
  ListBox,
  NumberField,
} from "@heroui/react";
import type { TableData } from "./CreateTableForm";
import { useTranslation } from "react-i18next";

const TableFieldInfo = ({
  id,
  onDelete,
  canRemove = true,
  setValue,
  data,
}: {
  id: number;
  canRemove?: boolean;
  onDelete: (id: number) => void;
  setValue: (id: number, value: Partial<TableData>) => void;
  data: Record<number, TableData>;
}) => {
  const { t } = useTranslation(["branch"]);
  return (
    <div id={id.toString()} className="relative">
      <Card className="min-h-40" variant="tertiary">
        {canRemove && (
          <CloseButton
            aria-label="Remove table"
            className="absolute top-2 right-2"
            onPress={() => onDelete(id)}
          />
        )}

        {/* capacity */}
        <Select
          defaultValue={data[id]?.capacity?.toString()}
          onChange={(key) => {
            setValue(id, { capacity: Number(key) });
          }}
        >
          <Label>{t("branchDetail.tables.capacity")}</Label>
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item id="4" textValue="4">
                {t("branchDetail.tables.data.4")}
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="6" textValue="6">
                {t("branchDetail.tables.data.6")}
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="8" textValue="8">
                {t("branchDetail.tables.data.8")}
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="10" textValue="10">
                {t("branchDetail.tables.data.10")}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>

        {/* quantity */}
        <NumberField
          defaultValue={data[id]?.quantity}
          minValue={1}
          onChange={(value) => {
            setValue(id, { quantity: value || 1 });
          }}
        >
          <Label>{t("branchDetail.tables.quantity")}</Label>
          <NumberField.Group>
            <NumberField.DecrementButton />
            <NumberField.Input />
            <NumberField.IncrementButton />
          </NumberField.Group>
        </NumberField>
      </Card>
    </div>
  );
};

export default TableFieldInfo;
