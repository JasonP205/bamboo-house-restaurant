import CreateDishDialog from "../dishes/CreateDishDialog";
import { Button, useOverlayState } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useBranchStore } from "@/stores/useBranchStore";
import DishCardSkeleton from "../dishes/DishCardSkeleton";
import { useEffect } from "react";
import DishCard from "../dishes/DishCard";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignCircleIcon } from "@hugeicons/core-free-icons";

const DishesTab = () => {

  const createDishState = useOverlayState();
  const { t } = useTranslation(["dishes"]);

  // useEffect(() => {
  //   const init = async () => {
  //       await fetchDishesInBranch();
  //   };
  //   init();
  // }, [selectedBranchId]);

  // if (loadingFetchDishes) {
  //   return (
  //     <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 w-full p-4">
  //       <DishCardSkeleton quantity={4} />
  //     </div>
  //   );
  // }

  if (false) {
    return (
      <div className="p-4 min-h-100 flex flex-col items-center justify-center gap-4">
        <p className="text-muted text-center">{t("createDish.state.empty")}</p>
        <div className="flex justify-center mt-4">
          <Button className="rounded-xl" onPress={createDishState.open}>
            {t("createDish.ctaButton")}
          </Button>
        </div>
        <CreateDishDialog
          state={createDishState}
          title={t("createDish.title")}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      
      
      <CreateDishDialog state={createDishState} title={t("createDish.title")} />
    </div>
  );
};

export default DishesTab;
