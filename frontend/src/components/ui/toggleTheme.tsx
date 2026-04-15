import { useTheme } from "@/hooks/themeHook";
import { Button, Tooltip } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Sun01Icon,
  Moon02Icon,
  ComputerIcon,
} from "@hugeicons/core-free-icons";
interface ToggleThemeProps {
  className?: string;
}
const ToggleTheme = ({ className }: ToggleThemeProps) => {
  const { mode, setMode } = useTheme();
  const switchMode = () => {
    if (mode === "light") {
      setMode("dark");
    } else if (mode === "dark") {
      setMode("system");
    } else {
      setMode("light");
    }
  };
  return (
    <div className={`z-50 ${className}`}>
      <Tooltip delay={0} closeDelay={0}>
        <Button isIconOnly variant="ghost" className="h-10 w-10 rounded-full text-muted hover:text-accent hover:dark:text-surface-secondary-foreground" onPress={switchMode}>
          {mode === "light" && (
            <HugeiconsIcon
              icon={Sun01Icon}
            />
          )}
          {mode === "dark" && (
            <HugeiconsIcon
              icon={Moon02Icon}
            />
          )}
          {mode === "system" && (
            <HugeiconsIcon
              icon={ComputerIcon}
            />
          )}
        </Button>
        <Tooltip.Content className="cursor-default" showArrow offset={4}>
          <Tooltip.Arrow />
          {mode === "light" && "Switch to Dark Mode"}
          {mode === "dark" && "Switch to System Mode"}
          {mode === "system" && "Switch to Light Mode"}
        </Tooltip.Content>
      </Tooltip>
    </div>
  );
};

export default ToggleTheme;
