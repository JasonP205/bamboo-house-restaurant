import { useBranchStore } from "@/stores/useBranchStore";
import { useTranslation } from "react-i18next";
import { Modal, Button, Tooltip } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Store01Icon, StoreAdd02Icon, Tool } from "@hugeicons/core-free-icons";
import CreateBranchForm from "./CreateBranchForm";
import { useState } from "react";

interface CreateBranchModalProps {
  isFloating?: boolean;
}

const CreateBranchModal = ({ isFloating }: CreateBranchModalProps) => {
  const { t } = useTranslation(["branch"]);
  const [open, setOpen] = useState(false);
  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      {isFloating ? (
        <>
          <Tooltip delay={0} closeDelay={0}>
            <Tooltip.Content showArrow>
              <Tooltip.Arrow />
              {t("createBranchButton")}
            </Tooltip.Content>
            <Button
              isIconOnly
              variant="primary"
              className="rounded-full size-14 absolute bottom-16 right-16"
              onPress={() => setOpen(true)}
            >
              <HugeiconsIcon className="size-8" icon={StoreAdd02Icon} />
            </Button>
          </Tooltip>
        </>
      ) : (
        <>
          <Button
            className={"min-w-sm"}
            variant="secondary"
            onPress={() => setOpen(true)}
          >
            {t("createBranchButton")}
          </Button>
        </>
      )}
      <Modal.Backdrop variant="blur">
        <Modal.Container size="lg" className="scrollbar-hidden">
          <Modal.Dialog className="scrollbar-hidden">
            <Modal.CloseTrigger />
            <Modal.Header>
              {/* <Modal.Icon className="bg-default text-foreground">
                <HugeiconsIcon size={24} icon={Store01Icon} />
                
              </Modal.Icon> */}
              <Modal.Heading>{t("createBranchForm.title")}</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <CreateBranchForm />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default CreateBranchModal;
