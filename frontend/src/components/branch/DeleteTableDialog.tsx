import { AlertDialog, Button, Spinner, useOverlayState } from "@heroui/react";
import { useTranslation } from "react-i18next";
interface DeleteTableDialogProps {
  onDelete: () => void;
  loading?: boolean;
  disabled?: boolean;
  state: ReturnType<typeof useOverlayState>;
}

const DeleteTableDialog = ({ onDelete, loading, disabled, state }: DeleteTableDialogProps) => {
  const { t } = useTranslation(["branch"]);
  return (
    <AlertDialog isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <Button  fullWidth variant="danger-soft" isDisabled={disabled}>
        Delete Table
      </Button>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[400px]">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>
                {t("branchDetail.deleteTable.title")}
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                {t("branchDetail.deleteTable.description")}
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                {t("branchDetail.deleteTable.cancelButton")}
              </Button>
              <Button isPending={loading} onClick={onDelete} variant="danger" isDisabled={disabled}>
                {loading ? t("branchDetail.deleteTable.processing") : t("branchDetail.deleteTable.confirmButton")}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
};

export default DeleteTableDialog;
