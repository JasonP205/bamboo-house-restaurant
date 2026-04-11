import { Description, Label, Select, ListBox, FieldError, type Key } from "@heroui/react";
import { cn } from "@/lib/utils";
interface SelectFieldProps {
  selectOptions: { value: string; label: string; description?: string }[];
  label: string;
  description?: string;
  placeholder?: string;
  onSelect?: (value: string) => void;
  onChange?:(value: Key | Key[] | null) => void;
  fullWidth?: boolean;
  defaultValue?: string;
  classNames?: {
    label?: string;
    description?: string;
  };
  isInvalid?: boolean;
  errorMessage?: string;
  mode?: "single" | "multiple";
}
const SelectField = ({
  selectOptions,
  classNames,
  label,
  description,
  placeholder,
  fullWidth = false,
  onSelect,
  onChange,
  defaultValue,
  isInvalid,
  errorMessage,
  mode = "single",
}: SelectFieldProps) => {
  return (
    <Select aria-label="select" isInvalid={isInvalid} onChange={onChange} fullWidth={fullWidth} defaultValue={defaultValue} placeholder={placeholder} selectionMode={mode}>
      <Label className={cn(classNames?.label)}>{label}</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      {description && <Description className={cn(classNames?.description)}>{description}</Description>}
      <Select.Popover>
        <ListBox selectionMode={mode}>
          {selectOptions.map((option) => (
            <ListBox.Item
              aria-label={option.label}
              key={option.value}
              id={option.value}
              onClick={() => onSelect?.(option.value)}
              textValue={option.value}
            >
              <Label className="capitalize">{option.label}</Label>
              {option.description && (
                <Description>{option.description}</Description>
              )}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
      {
        isInvalid && errorMessage && <FieldError>{errorMessage}</FieldError>
      }
    </Select>
  );
};
export default SelectField;
