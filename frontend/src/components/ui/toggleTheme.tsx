import { useTheme, type ThemeMode } from "@/hooks/themeHook";
import { Tabs } from "@heroui/react";
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
  return (
    <div className={`z-50 ${className}`}>
      <Tabs selectedKey={mode} onSelectionChange={(key) => setMode(key as ThemeMode)} className="w-full max-w-md">
      <Tabs.ListContainer>
        <Tabs.List aria-label="Options">
          <Tabs.Tab id="light">
            <HugeiconsIcon icon={Sun01Icon} className="size-4 text-muted" />
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="dark">
            <HugeiconsIcon icon={Moon02Icon} className="size-4 text-muted" />
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="system">
            <HugeiconsIcon icon={ComputerIcon} className="size-4 text-muted" />
            <Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
    </div>
  );
};

export default ToggleTheme;
