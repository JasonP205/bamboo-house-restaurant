import { Description, Header, Label, Select, ListBox, FieldError } from "@heroui/react";
import { cn } from "@/lib/utils";
interface SelectFieldProps {
  selectOptions: { value: string; label: string; description?: string }[];
  label: string;
  description?: string;
  placeholder?: string;
  onSelect: (value: string) => void;
  fullWidth?: boolean;
  defaultValue?: string;
  classNames?: {
    label?: string;
    description?: string;
  };
  isInvalid?: boolean;
  errorMessage?: string;
}
const SelectField = ({
  selectOptions,
  classNames,
  label,
  description,
  placeholder,
  fullWidth = false,
  onSelect,
  defaultValue,
  isInvalid,
  errorMessage,
}: SelectFieldProps) => {
  return (
    <Select isInvalid={isInvalid} fullWidth={fullWidth} defaultValue={defaultValue} placeholder={placeholder}>
      <Label className={cn(classNames?.label)}>{label}</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      {description && <Description className={cn(classNames?.description)}>{description}</Description>}
      <Select.Popover>
        <ListBox>
          {selectOptions.map((option) => (
            <ListBox.Item
              key={option.value}
              onClick={() => onSelect(option.value)}
              textValue={option.value}
            >
              <Label>{option.label}</Label>
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
