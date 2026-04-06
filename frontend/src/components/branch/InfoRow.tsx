import { Description } from "@heroui/react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

interface InfoRowProps {
  type: "primary" | "secondary";
  icon: IconSvgElement;
  label: string;
  value: string;
  secondaryIcon?: IconSvgElement;
  secondaryLabel?: string;
  secondaryValue?: string;
  desciption?: string;
}
const InfoRow = ({
  type = "primary",
  icon,
  label,
  value,
  secondaryIcon,
  secondaryLabel,
  secondaryValue,
  desciption,
}: InfoRowProps) => {
  if (type === "secondary") {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-background/10 rounded-full flex items-center justify-center dark:text-surface-secondary-foreground">
            <HugeiconsIcon icon={icon} />
          </div>
          <div>
            <p className="text-2xl font-serif dark:text-surface-secondary-foreground line-clamp-2">{value}</p>
            <p className="text-xs text-muted uppercase">{label}</p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-widest text-muted font-medium">
        {label}
      </p>
      <div className="flex items-center gap-3 pt-2 dark:text-surface-secondary-foreground">
        <div className="w-5 h-5">
          <HugeiconsIcon icon={icon} className="w-5 h-5" />
        </div>

        <p className="leading-relaxed font-light line-clamp-2">{value}</p>
      </div>
      {secondaryLabel && (
        <div className="flex items-center gap-3 pt-2">
          <div className="w-5 h-5 dark:text-surface-secondary-foreground">
            <HugeiconsIcon
              icon={secondaryIcon!}
              className="w-5 h-5"
            />
          </div>
          <p className="leading-relaxed font-light line-clamp-2">{secondaryValue}</p>
        </div>
      )}
      {desciption && (
        <Description className="italic font-light">{desciption}</Description>
      )}
    </div>
  );
};

export default InfoRow;
