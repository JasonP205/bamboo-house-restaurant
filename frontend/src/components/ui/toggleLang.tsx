import { Tabs } from "@heroui/react";
import { useTranslation } from "react-i18next";

interface ToggleLangProps {
  className?: string;
}

const ToggleLang = ({ className }: ToggleLangProps) => {
  const { i18n } = useTranslation();

  const handleChange = (key: React.Key) => {
    i18n.changeLanguage(key as string);
  };

  return (
    <div className={`z-100 ${className}`}>
      <Tabs
        selectedKey={i18n.language} // ✅ sync trực tiếp
        onSelectionChange={handleChange}
        className="w-full max-w-md"
      >
        <Tabs.ListContainer>
          <Tabs.List aria-label="Options">
            <Tabs.Tab id="en">
              EN
              <Tabs.Indicator />
            </Tabs.Tab>

            <Tabs.Tab id="vi"> {/* ✅ dùng vi luôn */}
              VI
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>
    </div>
  );
};

export default ToggleLang;