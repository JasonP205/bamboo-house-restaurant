import { Button, Modal, useOverlayState } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { DiningTableIcon } from "@hugeicons/core-free-icons";
import CreateTableForm from "@/components/table/CreateTableForm";
import { useTranslation } from "react-i18next";

const CreateTableModal = () => {
  const createTableState = useOverlayState();
  const { t } = useTranslation(["branch"]);

  return (
    <Modal isOpen={createTableState.isOpen} onOpenChange={createTableState.setOpen}>
      <Button onPress={createTableState.open} fullWidth variant="primary">
        {t("branchDetail.tables.addTable.button")}
      </Button>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header className="flex flex-row items-center gap-3">
              <Modal.Icon className="bg-default text-accent">
                <HugeiconsIcon icon={DiningTableIcon} />
              </Modal.Icon>
              <Modal.Heading className="text-accent">{t("branchDetail.tables.addTable.button")}</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="h-md">
              <CreateTableForm action={createTableState}/>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default CreateTableModal;
