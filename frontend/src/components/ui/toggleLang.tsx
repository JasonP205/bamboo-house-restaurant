import { Select, ListBox } from "@heroui/react";
import { useTranslation } from "react-i18next";

interface ToggleLangProps {
  className?: string;
}


const ToggleLang = ({ className }: ToggleLangProps) => {
  const { i18n } = useTranslation();
  const {t} = useTranslation(["common"]);
  const languages = [
  { code: "EN", label: t("toggleLangOptions.en"), id: "en" },
  { code: "VI", label: t("toggleLangOptions.vi"), id: "vi" }
];

  const handleChange = (key: React.Key) => {
    i18n.changeLanguage(key as string);
  };

  return (
    <div className={`z-50 ${className} min-w-30`}>
      <Select aria-label="select-language" value={i18n.language} placeholder="Select one" onChange={(key) => handleChange(key as React.Key)}>
        <Select.Trigger className={"rounded-full min-h-10 flex items-center"}>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover className="min-w-40">
          <ListBox>
            {languages.map((lang) => (
              <ListBox.Item aria-label={lang.label} key={lang.id} id={lang.id} textValue={lang.label}>
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