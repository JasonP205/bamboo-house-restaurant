import { NumberField, Label, Description, FieldError } from "@heroui/react";
import { cn } from "@/lib/utils";

interface NumberInputProps {
  label: string;
  description?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  fullWidth?: boolean;
  formatOptions?: Intl.NumberFormatOptions;
  classNames?: {
    label?: string;
    description?: string;
  };
}

const NumberInput = ({
  label,
  description,
  value,
  onChange,
  step,
  min,
  max,
  isInvalid,
  errorMessage,
  fullWidth,
  formatOptions,
  classNames,
}: NumberInputProps) => {
  return (
    <NumberField
      formatOptions={formatOptions}
      defaultValue={value}
      onChange={onChange}
      step={step}
      isInvalid={isInvalid}
      minValue={min}
      maxValue={max}
      fullWidth={fullWidth}
    >
      <Label className={cn(classNames?.label)}>{label}</Label>
      {description && (
        <Description className={cn(classNames?.description)}>
          {description}
        </Description>
      )}
      <NumberField.Group>
        <NumberField.DecrementButton />
        <NumberField.Input />
        <NumberField.IncrementButton />
      </NumberField.Group>
      <FieldError>{errorMessage}</FieldError>
    </NumberField>
  );
};

export default NumberInput;
