import { Button, useOverlayState, SearchField } from "@heroui/react";
import { useTranslation } from "react-i18next";
import CreateDishDialog from "@/components/dishes/CreateDishDialog";
import { useMenuStore } from "@/stores/useMenuStore";
import { useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import DishCard from "@/components/dishes/DishCard";
import { motion } from "motion/react";
import Fuse from "fuse.js";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const MenuPage = () => {
  const { t } = useTranslation(["dishes"]);
  const { i18n } = useTranslation();
  const createDishState = useOverlayState();
  const { menu, getMenu } = useMenuStore();

  useEffect(() => {
    const init = async () => {
      if (menu.length === 0) {
        await getMenu();
      }
      return;
    };
    init();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "appetizer" | "main" | "beverage" | "merchandise"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMenu = useMemo(() => {
    let data = menu;

    // 1. filter category trước
    if (selectedCategory !== "all") {
      data = data.filter((dish) => dish.category === selectedCategory);
    }

    // 2. search bằng fuse
    if (!searchTerm.trim()) {
      return data;
    }

    const results = new Fuse(data, {
      keys: [`name.${i18n.language}`],
      threshold: 0.3,
      ignoreLocation: true,
    }).search(searchTerm);

    return results.map((result) => result.item);
  }, [menu, selectedCategory, searchTerm]);

  if (menu.length === 0) {
    return (
      <div className="p-4 min-h-100 flex flex-col items-center justify-center gap-4">
        <p className="text-muted text-center">{t("createDish.state.empty")}</p>
        <CreateDishDialog state={createDishState} title={t("createDish.title")}>
          <div className="flex justify-center mt-4">
            <Button className="rounded-xl" onPress={createDishState.open}>
              {t("createDish.ctaButton")}
            </Button>
          </div>
        </CreateDishDialog>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 p-10">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
        <div className="flex-col flex gap-4">
          <span className="font-bold dark:text-muted text-accent tracking-widest text-xs uppercase block">
            Curated Cuisine
          </span>
          <h1 className="text-5xl md:text-6xl font-serif text-accent italic text-on-surface leading-tight -ml-1">
            Seasonal Menu
          </h1>
          <p className="text-muted font-body leading-relaxed opacity-80">
            Our seasonal selection is a dialogue between local foraging and
            elevated culinary technique. Each dish is a living composition of
            texture, color, and heritage.
          </p>
        </div>
        <CreateDishDialog state={createDishState} title={t("createDish.title")}>
          <Button
            onPress={createDishState.open}
            size="lg"
            className="capitalize shadow-accent/30 shadow-xl rounded-xl flex text-xs items-center tracking-wider text-white"
          >
            <HugeiconsIcon
              icon={PlusSignIcon}
              size={24}
              color="currentColor"
              strokeWidth={3}
            />
            <span>{t("createDish.createAnotherButton")}</span>
          </Button>
        </CreateDishDialog>
      </div>
      <div className="flex items-center justify-between">
        <nav>
          <ul className="flex gap-6 relative">
            {[
              { label: t("dish.category.all"), value: "all" },
              { label: t("dish.category.appetizer"), value: "appetizer" },
              { label: t("dish.category.main"), value: "main" },
              { label: t("dish.category.beverage"), value: "beverage" },
              { label: t("dish.category.merchandise"), value: "merchandise" },
            ].map((category) => {
              const isActive = selectedCategory === category.value;

              return (
                <li
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value as any)}
                  className="relative cursor-pointer font-serif italic text-base font-medium capitalize tracking-wider"
                >
                  <span
                    className={`transition-smooth duration-300 ${isActive ? "text-accent" : "text-muted hover:text-accent"}`}
                  >
                    {category.label}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                      className="absolute left-0 right-0 -bottom-2 h-0.5 bg-accent rounded"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        <SearchField aria-label="search-food" value={searchTerm} onChange={setSearchTerm}>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input className="w-70" placeholder="Search by Name" />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full p-4">
        {filteredMenu.map((dish) => (
          <DishCard key={dish._id} dish={dish} />
        ))}
        {filteredMenu.length === 0 && searchTerm.trim() && (
          <div className="flex flex-col items-center justify-center gap-4 col-span-full">
            <DotLottieReact className="max-w-md" src="/lotties/no-food.lottie" loop autoplay />
            <p className="text-muted text-center col-span-full">
              {t("search.noResults", { searchTerm })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
