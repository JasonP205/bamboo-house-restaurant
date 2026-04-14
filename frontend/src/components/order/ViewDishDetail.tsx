import type { Dish } from "@/types/menu";
import {
  Drawer,
  ScrollShadow,
  TextField,
  InputGroup,
  Label,
  Button,
  Separator,
  toast,
} from "@heroui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOrderStore } from "@/stores/useOrderStore";
import { MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface ViewDishDetailProps {
  dish: Dish;
  children?: React.ReactNode;
  className?: string;
}
const ViewDishDetail = ({ dish, children, className }: ViewDishDetailProps) => {
  const { i18n } = useTranslation();
  const { t } = useTranslation(["order"]);
  const { addToCart, cart } = useOrderStore();
  const currentQuantity =
    cart.find((item) => item.dish._id === dish._id)?.quantity || 0;
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(currentQuantity + 1);

  const handleAddToCart = () => {
    addToCart(dish, quantity, notes);
    toast.success(t("order.addedToCart"));
  };

  return (
    <Drawer>
      <Drawer.Trigger className={className}>{children}</Drawer.Trigger>
      <Drawer.Backdrop>
        <Drawer.Content placement="bottom">
          <Drawer.Dialog>
            <Drawer.Handle />
            <Drawer.Body className="scrollbar-hidden">
              <div className="rounded-xl relative">
                <img
                  src={dish.imageUrl}
                  alt={dish.name.en}
                  className="w-full h-full aspect-square rounded-xl object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2 text-white px-2 py-1 rounded-lg text-xs">
                  {dish.dietary &&
                    dish.dietary.map((diet) => (
                      <span
                        key={diet}
                        className="capitalize bg-warning/80 backdrop-blur-sm px-2 py-1 rounded-full"
                      >
                        {diet}
                      </span>
                    ))}
                </div>
                <div className="absolute rounded-xl inset-0 flex items-end bg-linear-to-t from-accent/80 to-transparent p-4">
                  <div className="flex-1 flex justify-between flex-row gap-2 text-white">
                    <h3 className="text-lg font-semibold font-serif capitalize italic">
                      {dish.name[i18n.language as keyof typeof dish.name]}
                    </h3>
                    <span className="text-2xl self-end font-semibold font-serif mt-1">
                      ${dish.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 mt-4">
                <ScrollShadow className="max-h-30 mt-2 scrollbar-hidden">
                  <p className="text-sm text-muted">
                    {
                      dish.description[
                        i18n.language as keyof typeof dish.description
                      ]
                    }
                  </p>
                </ScrollShadow>
                <div className="flex flex-col gap-4 mt-4">
                  <TextField>
                    <Label>{t("order.notes")}</Label>
                    <InputGroup>
                      <InputGroup.TextArea
                        placeholder={t("order.notesPlaceholder")}
                        value={notes}
                        className="resize-none text-sm"
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </InputGroup>
                  </TextField>
                </div>
                <div className="rounded-xl border border-muted p-2 flex items-center gap-4 w-full">
                  <button
                    onClick={() => {
                      setQuantity((prev) => prev - 1);
                    }}
                    className="w-1/4 flex items-center justify-center"
                    disabled={quantity <= 1}
                  >
                    <HugeiconsIcon size={12} icon={MinusSignIcon} />
                  </button>
                  <Separator orientation="vertical" className="h-6" />
                  <span className="w-2/4 text-center">{quantity}</span>
                  <Separator orientation="vertical" className="h-6" />
                  <button
                    onClick={() => {
                      setQuantity((prev) => prev + 1);
                    }}
                    className="w-1/4 flex items-center justify-center"
                  >
                    <HugeiconsIcon size={12} icon={PlusSignIcon} />
                  </button>
                </div>
                <Button
                  slot="close"
                  fullWidth
                  className="rounded-xl "
                  onClick={handleAddToCart}
                >
                  {currentQuantity > 0
                    ? t("order.updateCart")
                    : t("order.addToCart")}
                </Button>
              </div>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
};

export default ViewDishDetail;
