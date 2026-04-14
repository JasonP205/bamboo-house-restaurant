import { Modal } from "@heroui/react";
import { Add } from "@hugeicons/core-free-icons";
import AddStaffForm from "./AddStaffForm";
import { useTranslation } from "react-i18next";

interface AddStaffDialogProps {
  // You can add props here if needed, such as:
  // onClose?: () => void;
  children?: React.ReactNode; // Custom trigger element for opening the dialog
  className?: string; // Optional className for styling
}

const AddStaffDialog = ({ children, className }: AddStaffDialogProps) => {
  const { t } = useTranslation("auth");
  return (
    <Modal>
      <Modal.Trigger className={className}>{children}</Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog data-custom="lg-expanded">
            <Modal.CloseTrigger /> {/* Optional: Close button */}
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
