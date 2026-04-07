import CreateDishDialog from "../dishes/CreateDishDialog"
import { Button, useOverlayState } from "@heroui/react"
import { useTranslation } from "react-i18next";
const DishesTab = () => {
  const createDishState = useOverlayState();
  const { t } = useTranslation(["dishes"]);
  return (
    <div>
        <Button onPress={createDishState.open}>
            Create New Dish
        </Button>
        <CreateDishDialog state={createDishState} title={t("createDish.title")} />
    </div>
  )
}

export default DishesTab