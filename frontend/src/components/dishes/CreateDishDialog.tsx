import { Modal, toast, useOverlayState } from "@heroui/react";
import CreateDishForm from "./CreateDishForm";
import { Bread03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { DishFormData } from "./CreateDishForm";
import { useTranslation } from "react-i18next";
import { useMenuStore } from "@/stores/useMenuStore";
import {cn} from "@/lib/utils";

interface CreateDishDialogProps {
  state: ReturnType<typeof useOverlayState>;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}
const CreateDishDialog = ({ state, title, children, className }: CreateDishDialogProps) => {
  const { t } = useTranslation(["dishes"]);
  // const { addDish, loadingCreateDish } = useBranchStore();
  const { addDish, loadingCreateDish } = useMenuStore();
  const onCreateDish = async (data: DishFormData) => {
    console.log("Dish Data:", data);
    try {
      await addDish(data);
      toast.success(t("toast.createDishSuccess"));
      state.close();
    } catch (error) {
      toast.danger(t("toast.createDishError"));
    } 
  };
  return (
    <Modal isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <Modal.Trigger className={cn(className)}>
        {children}
      </Modal.Trigger>
      <Modal.Backdrop variant="blur">
        <Modal.Container size="lg">
          <Modal.Dialog data-custom="add-dish">
            <Modal.CloseTrigger /> {/* Optional: Close button */}
            <Modal.Header className="flex flex-row items-center">
              <Modal.Icon className="p-2 bg-surface-secondary rounded-full text-text">
                <HugeiconsIcon icon={Bread03Icon} />
              </Modal.Icon>{" "}
              {/* Optional: Icon */}
              <Modal.Heading className="font-serif text-2xl text-text">
                {title}
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <CreateDishForm loading={loadingCreateDish} onSubmit={onCreateDish} onClose={state.close} />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default CreateDishDialog;
