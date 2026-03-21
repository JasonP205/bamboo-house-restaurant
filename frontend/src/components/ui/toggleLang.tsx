import { Select, ListBox } from "@heroui/react";
import { useTranslation } from "react-i18next";

interface ToggleLangProps {
  className?: string;
  /** When true, renders as compact icon-only toggle buttons instead of a Select dropdown */
  compact?: boolean;
}

const LANGUAGES = [
  { code: "EN", id: "en" },
  { code: "VI", id: "vi" },
];

const ToggleLang = ({ className, compact }: ToggleLangProps) => {
  const { i18n } = useTranslation();
  const { t } = useTranslation(["common"]);

  const languages = [
    { code: "EN", label: t("toggleLangOptions.en"), id: "en" },
    { code: "VI", label: t("toggleLangOptions.vi"), id: "vi" },
  ];

  const handleChange = (key: React.Key) => {
    i18n.changeLanguage(key as string);
  };

  /* ── Compact mode: pill buttons ── */
  if (compact) {
    return (
      <div className={`flex items-center gap-1 ${className ?? ""}`}>
        {LANGUAGES.map((lang) => {
          const isActive = i18n.language === lang.id;
          return (
            <button
              key={lang.id}
              onClick={() => i18n.changeLanguage(lang.id)}
              className={[
                "text-xs font-semibold px-2.5 py-1 rounded-full transition-colors",
                isActive
                  ? "bg-(--accent) text-accent-foreground"
                  : "text-muted hover:bg-surface-secondary hover:text-(--foreground)",
              ].join(" ")}
              aria-pressed={isActive}
              aria-label={`Switch to ${lang.code}`}
            >
              {lang.code}
            </button>
          );
        })}
      </div>
    );
  }

  /* ── Default mode: Select dropdown ── */
  return (
    <div className={`z-50 ${className ?? ""} min-w-30`}>
      <Select
        aria-label="select-language"
        value={i18n.language}
        onChange={(key) => handleChange(key as React.Key)}
      >
        <Select.Trigger className={"bg-default rounded-full min-h-10 flex items-center"}>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover className="min-w-40">
          <ListBox>
            {languages.map((lang) => (
              <ListBox.Item
                aria-label={lang.label}
                key={lang.id}
                id={lang.id}
                textValue={lang.label}
              >
                <div className="flex items-center gap-4">
                  <span className="text-muted self-start">{lang.code}</span>
                  <span className="self-end">{lang.label}</span>
                </div>
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
};

export default ToggleLang;