import {
  Button,
  Tooltip,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { HugeiconsIcon } from "@hugeicons/react";
import { LanguageSkillIcon } from "@hugeicons/core-free-icons";

interface ToggleLangProps {
  className?: string;
  /** When true, renders as compact icon-only toggle buttons instead of a Select dropdown */
  compact?: boolean;
}

const ToggleLang = ({ className, compact }: ToggleLangProps) => {
  const { i18n } = useTranslation();
  const { t } = useTranslation(["common"]);

  const switchLang = () => {
    if (i18n.language === "en") {
      i18n.changeLanguage("vi");
    } else {
      i18n.changeLanguage("en");
    }
  };

  /* ── Compact mode: pill buttons ── */
  if (compact) {
    return (
      <div className={`z-50 ${className ?? ""}`}>
      <Tooltip delay={0} closeDelay={0}>
        <Button
          onPress={switchLang}
          isIconOnly
          variant="ghost"
          className="h-10 w-10 rounded-full text-muted hover:text-accent"
        >
          <HugeiconsIcon icon={LanguageSkillIcon} />
        </Button>
        <Tooltip.Content className="cursor-default" showArrow offset={4}>
          <Tooltip.Arrow />
          {i18n.language === "en"
            ? t("toggleLangOptions.vi")
            : t("toggleLangOptions.en")}
        </Tooltip.Content>
      </Tooltip>
    </div>
    );
  }

  /* ── Default mode: Select dropdown ── */
  return (
    <div className={`z-50 ${className ?? ""}`}>
      <Tooltip delay={0} closeDelay={0}>
        <Button
          onPress={switchLang}
          isIconOnly
          variant="ghost"
          className="h-10 w-10 rounded-full text-muted hover:text-accent dark:hover:text-surface-secondary-foreground"
        >
          <HugeiconsIcon icon={LanguageSkillIcon} />
        </Button>
        <Tooltip.Content showArrow offset={4}>
          <Tooltip.Arrow />
          {i18n.language === "en"
            ? t("toggleLangOptions.vi")
            : t("toggleLangOptions.en")}
        </Tooltip.Content>
      </Tooltip>
    </div>
  );
};

export default ToggleLang;
