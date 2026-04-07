import { Button, Modal, useOverlayState } from "@heroui/react";
import CreateDishForm from "./CreateDishForm";
import { Bread03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
interface CreateDishDialogProps {
  state: ReturnType<typeof useOverlayState>;
  title?: string;
}
const CreateDishDialog = ({ state, title }: CreateDishDialogProps) => {
  const onCreateDish = (data: any) => {
    console.log("Dish Data:", data);
  };
  return (
    <Modal isOpen={state.isOpen} onOpenChange={state.setOpen}>
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
              <CreateDishForm onSubmit={onCreateDish} onCancel={state.close} />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default CreateDishDialog;
