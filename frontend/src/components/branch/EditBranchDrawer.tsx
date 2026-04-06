import { Drawer, useOverlayState } from "@heroui/react";
import { useTranslation } from "react-i18next";
import EditBranchForm from "./EditBranchForm";
interface EditBranchDrawerProps {
  state: ReturnType<typeof useOverlayState>;
  className?: string;
}

const EditBranchDrawer = ({ state }: EditBranchDrawerProps) => {
  const { t } = useTranslation(["branch"]);
  return (
    <Drawer isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <Drawer.Backdrop variant="blur">
        <Drawer.Content placement="right">
          <Drawer.Dialog>
            <Drawer.CloseTrigger /> {/* Optional: Close button */}
            <Drawer.Header>
              <Drawer.Heading className="font-serif text-accent dark:text-surface-secondary-foreground text-2xl">
                {t("editBranch.title")}
              </Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body className="scrollbar-hidden">
              <EditBranchForm state={state} />
            </Drawer.Body>
            <Drawer.Footer />
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
};

export default EditBranchDrawer;
