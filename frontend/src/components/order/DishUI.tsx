import type { Dish } from "@/types/menu";
import { Card } from "@heroui/react";
import { useTranslation } from "react-i18next";

import ViewDishDetail from "./ViewDishDetail";
interface DishUIProps {
  dish: Dish;
}

const DishUI = ({ dish }: DishUIProps) => {
  const { i18n } = useTranslation();
  return (
    <ViewDishDetail dish={dish} className="w-full">
      <Card className="w-full p-2 rounded-lg shadow-none items-center border-none flex flex-row gap-2">
        <div className="shrink-0">
          <img
            src={dish.imageUrl}
            alt={dish.name[i18n.language as keyof typeof dish.name]}
            className="w-16 h-16 rounded-md object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <h3 className="text-sm self-start font-semibold capitalize line-clamp-1">
            {dish.name[i18n.language as keyof typeof dish.name]}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            {dish.dietary.map((diet) => (
              <span
                key={diet}
                className="text-xs text-white bg-warning/80 px-2 capitalize rounded-full py-1"
              >
                {diet}
              </span>
            ))}
          </div>
          <span className="text-sm self-end font-medium mt-1">
            ${dish.price.toFixed(2)}
          </span>
        </div>
      </Card>
    </ViewDishDetail>
  );
};

export default DishUI;
