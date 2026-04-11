import { useMenuStore } from "@/stores/useMenuStore";
import type { Dish } from "@/types/menu";
import { Spinner, Switch, toast } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
interface DishCardProps {
  dish: Dish;
}

const DishCard = ({ dish }: DishCardProps) => {
  const { changeDishStatus, loadingToggleDishStatus } = useMenuStore();
  const { i18n } = useTranslation();
  const { t } = useTranslation(["dishes"]);
  const handleToggleStatus = async () => {
    if (loadingToggleDishStatus[dish._id]) return; // Prevent multiple clicks
    try {
      await changeDishStatus(dish._id);
    } catch (error) {
      toast.danger(t("toast.toggleStatusError"));
    }
  };
  return (
    <Link to={`/app/menu/${dish._id}`}>
      <div className="group relative bg-surface md:min-h-140 lg:min-h-125 rounded-xl overflow-hidden transition-all duration-300">
        {!dish.isAvailable && <div className="sold-out-tag"></div>}
        <div className="aspect-square overflow-hidden relative">
          <img
            loading="lazy"
            className={`w-full h-full object-cover transition-smooth duration-700 group-hover:scale-110 ${!dish.isAvailable ? "grayscale-80 brightness-50" : ""}`}
            data-alt="overhead shot of a vibrant green heirloom tomato tart with delicate basil microgreens and edible white flowers on a textured ceramic plate"
            src={dish.imageUrl}
          />
          <div className="absolute top-4 right-4 flex gap-2">
            {dish.dietary &&
              dish.dietary.map((diet) => (
                <span
                  key={diet}
                  className={`bg-warning/80 text-white transition-smooth duration-700 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase tracking-tighter ${!dish.isAvailable ? "grayscale-80 brightness-50" : ""}`}
                >
                  {diet}
                </span>
              ))}
          </div>
        </div>
        <div className="p-6 flex justify-between flex-col min-h-62">
          <div>
            <div className="flex justify-between items-start mb-2 gap-2">
              <h3 className="font-serif text-xl italic text-text capitalize line-clamp-3">
                {dish.name[i18n.language as "en" | "vi"]}
              </h3>
              <span className="font-body font-bold text-primary">
                ${dish.price.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed opacity-70 mb-6 line-clamp-3">
              {dish.description[i18n.language as "en" | "vi"]}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${dish.isAvailable ? "bg-green-500" : "bg-red-500"}`}
              ></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                {dish.isAvailable ? t("dish.available") : t("dish.unavailable")}
              </span>
            </div>
            <Switch
              isDisabled={loadingToggleDishStatus[dish._id]}
              isSelected={dish.isAvailable}
              onChange={handleToggleStatus}
            >
              <Switch.Control>
                <Switch.Thumb>
                  {loadingToggleDishStatus[dish._id] ? (
                    <Spinner size="sm" />
                  ) : null}
                </Switch.Thumb>
              </Switch.Control>
            </Switch>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DishCard;
