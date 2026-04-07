import { Label, Tag, TagGroup } from "@heroui/react";
import { useState } from "react";

interface TagSelectProps {
  label: string;
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  mode: "single" | "multiple";
  direction?: "horizontal" | "vertical";
}

const TagSelect = ({
  label,
  options,
  selectedValues,
  onChange,
  mode,
  direction = "horizontal",
}: TagSelectProps) => {
    const [prevSelected, setPrevSelected] = useState<string[]>(selectedValues);
  const handleSelectionChange = (keys: "all" | Set<React.Key>) => {
    if (keys === "all") return;

    const newValues = Array.from(keys, (key) => String(key));

    // chỉ áp dụng cho multiple
    if (mode === "multiple") {
      // tìm item vừa được thêm
      const added = newValues.find(v => !selectedValues.includes(v));

      if (added) {
        let updated = [...selectedValues, added];

        // nếu > 3 thì bỏ cái đầu
        if (updated.length > 3) {
          updated = updated.slice(1);
        }
        setPrevSelected(updated);
        onChange(updated);
        return;
      }

      // case unselect bình thường
      onChange(newValues);
      return;
    }

    // single mode
    onChange(newValues);
  };

  return (
    <TagGroup
      selectedKeys={selectedValues}
      selectionMode={mode}
      onSelectionChange={handleSelectionChange}
    >
      <Label className="uppercase text-text tracking-wider">
        {label}
      </Label>

      <TagGroup.List
        className={`flex ${
          direction === "vertical" ? "flex-col" : "flex-row"
        } gap-2`}
      >
        {options.map((option) => (
          <Tag key={option.value} id={option.value} textValue={option.label}>
            {option.label}
          </Tag>
        ))}
      </TagGroup.List>
    </TagGroup>
  );
};

export default TagSelect;