import { AlertDialog, Button, type ButtonProps } from "@heroui/react";
import { useTranslation } from "react-i18next";

interface AlertDialogProps extends ButtonProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  onConfirm?: () => void;
  loading?: boolean;
}

export default ({
  children,
  title,
  description,
  className,
  onConfirm,
  loading,
  ...buttonProps
}: AlertDialogProps) => {
    const { t } = useTranslation(["common"]);
  return (
    <AlertDialog>
      <Button className={className} {...buttonProps} isPending={loading}>
        {children}
      </Button>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog>
            <AlertDialog.CloseTrigger /> {/* Optional: Close button */}
            <AlertDialog.Header>
              <AlertDialog.Heading>{title}</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>{description}</p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button variant="outline" slot="close">
                {t("common.cancel")}
              </Button>
              <Button {...buttonProps} onClick={onConfirm} isPending={loading}>
                {t("common.confirm")}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
};
