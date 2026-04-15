import { Button, Tooltip } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { HugeiconsIcon } from "@hugeicons/react";
import { LanguageSkillIcon } from "@hugeicons/core-free-icons";

interface ToggleLangProps {
  className?: string;
}

const ToggleLang = ({ className }: ToggleLangProps) => {
  const { i18n } = useTranslation();
  const { t } = useTranslation(["common"]);

  const switchLang = () => {
    if (i18n.language === "en") {
      i18n.changeLanguage("vi");
    } else {
      i18n.changeLanguage("en");
    }
  };

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
