import { Modal } from "@heroui/react";
import AddStaffForm from "./AddStaffForm";
import { useTranslation } from "react-i18next";

interface AddStaffDialogProps {

  children?: React.ReactNode; 
  className?: string; 
}

const AddStaffDialog = ({ children, className }: AddStaffDialogProps) => {
  const { t } = useTranslation(["auth", "branch"]);
  return (
    <Modal>
      <Modal.Trigger className={className}>{children}</Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog data-custom="lg-expanded">
            <Modal.CloseTrigger /> 
            <Modal.Header>
              <Modal.Heading>{t("managerPanel.registerForm.title")}</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <AddStaffForm />
            </Modal.Body>
            <Modal.Footer />
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default AddStaffDialog;
