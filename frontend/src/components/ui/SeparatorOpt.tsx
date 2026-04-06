import { Separator } from "@heroui/react";
import { cn } from "@/lib/utils";
interface SeparatorOptProps {
  className?: string;
  variant?: "default" | "secondary" | "tertiary";
  value: string;
  classNames?: {
    separator?: string;
    text?: string;
  };
  props?: {
    left?: React.ComponentProps<typeof Separator>;
    right?: React.ComponentProps<typeof Separator>;
  };
}

const SeparatorOpt = ({
  className,
  value,
  classNames,
  props = {},
  variant = "default",
}: SeparatorOptProps) => {
  return (
    <div className={cn("flex items-center gap-2 max-w-full", className)}>
      <Separator
        variant={variant}
        className={cn("shrink bg-muted", classNames?.separator)}
        {...props.left}
      />
      <span
        className={cn(
          "text-center text-xs text-muted flex-1 uppercase",
          classNames?.text,
        )}
      >
        {value}
      </span>
      <Separator
        variant={variant}
        className={cn("shrink bg-muted", classNames?.separator)}
        {...props.right}
      />
    </div>
  );
};

export default SeparatorOpt;
