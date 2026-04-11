import { useParams } from "react-router-dom";
import { useMenuStore } from "@/stores/useMenuStore";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ImageInput from "@/components/common/ImageInput";
import {
  Button,
  Card,
  Breadcrumbs,
  TextField,
  Label,
  InputGroup,
  FieldError,
  Description,
} from "@heroui/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SelectField from "@/components/common/SelectField";
import NumberInput from "@/components/common/NumberInput";
import { Link } from "react-router-dom";
const dishEditSchema = z.object({
  name: z.object({
    en: z.string().min(1, "English name is required"),
    vi: z.string().min(1, "Vietnamese name is required"),
  }),
  category: z.string().min(1, "Category is required"),
  description: z.object({
    en: z.string().min(1, "English description is required"),
    vi: z.string().min(1, "Vietnamese description is required"),
  }),
  price: z.number().positive("Price must be a positive number"),
  branchIds: z.array(z.string()).min(1, "At least one branch must be selected"),
  image: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Image must be less than 5MB",
    )
    .optional(),
  dietary: z.array(z.string()).optional(),
});
type DishEditFormData = z.infer<typeof dishEditSchema>;
const DishDetail = () => {
  const { dishId } = useParams();
  const { selectedDish, loadingFetchDishes, getDishById } = useMenuStore();
  const { t } = useTranslation(["dishes"]);
  const { t: tCommon } = useTranslation(["common"]);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (dishId) {
      getDishById(dishId);
    }
  }, [dishId]);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<DishEditFormData>({
    resolver: zodResolver(dishEditSchema),
    defaultValues: {
      name: {
        en: selectedDish?.name.en || "",
        vi: selectedDish?.name.vi || "",
      },
      description: {
        en: selectedDish?.description.en || "",
        vi: selectedDish?.description.vi || "",
      },
      category: selectedDish?.category || "",
      price: selectedDish?.price || 0,
      dietary: selectedDish?.dietary || [],
    },
  });
  const dietaryOptions = [
    { value: "vegan", label: t("createDish.form.label.dietaryValues.vegan") },
    {
      value: "gluten-free",
      label: t("createDish.form.label.dietaryValues.glutenFree"),
    },
    {
      value: "nut-free",
      label: t("createDish.form.label.dietaryValues.nutFree"),
    },
  ];
  const [selectedDietary, setSelectedDietary] = useState<string[]>(
    selectedDish?.dietary || [],
  );
  const handleDietaryChange = (values: string[]) => {
    setSelectedDietary(values);
    setValue("dietary", values, { shouldValidate: true, shouldDirty: true });
  };
  if (loadingFetchDishes || !selectedDish) {
    return <div>Loading...</div>;
  }
  if (!selectedDish) {
    return <div>Dish not found</div>;
  }
  const onSubmit = (data: DishEditFormData) => {
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full">
      <div className="w-full flex flex-col gap-6 p-10">
        <Breadcrumbs>
          <Breadcrumbs.Item>
            <Link to="/app/menu">{tCommon("staffNavItems.menu")}</Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item className="capitalize">
            {selectedDish.name[i18n.language as "en" | "vi"]}
          </Breadcrumbs.Item>
        </Breadcrumbs>
        <div className="lg:grid lg:grid-cols-3 flex flex-col gap-6">
          <div className="flex-col flex gap-4 w-full col-span-2">
            <h1 className="text-5xl capitalize text-balance md:text-6xl font-serif text-accent italic text-on-surface leading-tight -ml-1">
              {selectedDish.name[i18n.language as "en" | "vi"]}
            </h1>
            <p className="text-muted font-body leading-relaxed opacity-80">
              {selectedDish.description[i18n.language as "en" | "vi"]}
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 w-full lg:flex-row col-span-1">
            <Button
              className="rounded-xl flex-1 lg:h-15 shadow-lg hover:shadow-xl hover:shadow-danger/30 shadow-danger-soft transition-smooth duration-300"
              size="lg"
              fullWidth
              variant="danger-soft"
            >
              Delete Dish
            </Button>
            <Button
              fullWidth
              type="submit"
              className="rounded-xl flex-1 lg:h-15 shadow-lg hover:shadow-xl hover:shadow-accent/30 shadow-accent-soft transition-smooth duration-300"
              size="lg"
            >
              Apply Changes
            </Button>
          </div>
          <div className="md:col-span-2">
            <Card>
              <Card.Header>
                <h2 className="text-xl font-serif italic text-accent">
                  {t("dishDetail.details")}
                </h2>
              </Card.Header>
              <Card.Content className="p-4 gap-4">
                <div className="flex flex-col md:flex-row gap-4 w-full">
                  <TextField isInvalid={!!errors.name?.en} fullWidth>
                    <Label
                      htmlFor="name-en"
                      className="uppercase text-text tracking-wider"
                    >
                      {t("createDish.form.label.name.en")}
                    </Label>
                    <InputGroup fullWidth>
                      <InputGroup.Input
                        id="name-en"
                        value={selectedDish.name.en}
                        className="capitalize"
                        placeholder={t("createDish.form.placeholder.name.en")}
                        {...register("name.en")}
                      />
                    </InputGroup>
                    <FieldError>
                      {t("createDish.form.validation.name.en")}
                    </FieldError>
                  </TextField>
                  <TextField isInvalid={!!errors.name?.vi} fullWidth>
                    <Label
                      htmlFor="name-vi"
                      className="uppercase text-text tracking-wider"
                    >
                      {t("createDish.form.label.name.vi")}
                    </Label>
                    <InputGroup fullWidth>
                      <InputGroup.Input
                        value={selectedDish.name.vi}
                        id="name-vi"
                        className="capitalize"
                        placeholder={t("createDish.form.placeholder.name.vi")}
                        {...register("name.vi")}
                      />
                    </InputGroup>
                    <FieldError>
                      {t("createDish.form.validation.name.vi")}
                    </FieldError>
                  </TextField>
                </div>
                <div className="flex flex-col md:flex-row gap-4 w-full">
                  <NumberInput
                    label={t("createDish.form.label.price")}
                    onChange={(value) =>
                      setValue("price", value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    value={selectedDish.price}
                    min={0}
                    fullWidth
                    isInvalid={!!errors.price}
                    errorMessage={t("createDish.form.validation.price")}
                    formatOptions={{
                      style: "currency",
                      currency: "USD",
                      currencySign: "accounting",
                    }}
                    classNames={{
                      label: "uppercase text-text tracking-wider",
                    }}
                  />
                  <SelectField
                    label={t("createDish.form.label.category")}
                    fullWidth
                    defaultValue={selectedDish.category}
                    isInvalid={!!errors.category}
                    errorMessage={t("createDish.form.validation.category")}
                    placeholder={t("createDish.form.placeholder.category")}
                    selectOptions={[
                      {
                        value: "appetizer",
                        label: t(
                          "createDish.form.label.categoryValues.appetizer",
                        ),
                      },
                      {
                        value: "main",
                        label: t("createDish.form.label.categoryValues.main"),
                      },
                      {
                        value: "dessert",
                        label: t(
                          "createDish.form.label.categoryValues.dessert",
                        ),
                      },
                      {
                        value: "beverage",
                        label: t(
                          "createDish.form.label.categoryValues.beverage",
                        ),
                      },
                    ]}
                    onSelect={(value) =>
                      setValue("category", value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    classNames={{
                      label: "uppercase text-text tracking-wider",
                    }}
                  />
                </div>
                <TextField isInvalid={!!errors.description?.en} fullWidth>
                  <Label
                    htmlFor="description-en"
                    className="uppercase text-text tracking-wider"
                  >
                    {t("createDish.form.label.description")}
                  </Label>
                  <InputGroup fullWidth>
                    <InputGroup.TextArea
                      id="description-en"
                      className={`resize-none`}
                      value={selectedDish.description.en}
                      maxLength={500}
                      rows={6}
                      placeholder={t("createDish.form.placeholder.description")}
                      {...register("description.en")}
                    />
                  </InputGroup>
                  <FieldError>
                    {t("createDish.form.validation.description")}
                  </FieldError>
                </TextField>
                <TextField isInvalid={!!errors.description?.vi} fullWidth>
                  <Label
                    htmlFor="description-vi"
                    className="uppercase text-text tracking-wider"
                  >
                    {t("createDish.form.label.description")}
                  </Label>
                  <InputGroup fullWidth>
                    <InputGroup.TextArea
                      id="description-vi"
                      className={`resize-none`}
                      maxLength={500}
                      value={selectedDish.description.vi}
                      rows={6}
                      placeholder={t("createDish.form.placeholder.description")}
                      {...register("description.vi")}
                    />
                  </InputGroup>
                  <FieldError>
                    {t("createDish.form.validation.description")}
                  </FieldError>
                </TextField>
                <div className="flex flex-col gap-2">
                  <Label className="uppercase text-text tracking-wider block">
                    {t("createDish.form.label.dietary")}
                  </Label>
                  <div className="flex gap-2 w-full max-w-full overflow-x-auto scrollbar-hidden">
                    {dietaryOptions.map((option) => (
                      <span
                        onClick={() => {
                          handleDietaryChange(
                            selectedDietary.includes(option.value)
                              ? selectedDietary.filter(
                                  (v) => v !== option.value,
                                )
                              : [...selectedDietary, option.value],
                          );
                        }}
                        className={`px-3 py-2 rounded-full transition-smooth duration-300 ${selectedDietary.includes(option.value) ? "bg-warning text-text" : "bg-surface-secondary text-text hover:bg-warning-soft"}`}
                        key={option.value}
                      >
                        {option.label}
                      </span>
                    ))}
                  </div>
                  <Description className="text-muted text-xs text-balance max-w-sm">
                    {t("createDish.form.label.dietaryDescription")}
                  </Description>
                </div>
              </Card.Content>
            </Card>
          </div>
          <div className="md:col-span-1">
            <Card>
              <Card.Header>
                <h2 className="text-xl font-serif italic text-accent">
                  {t("dishDetail.image")}
                </h2>
              </Card.Header>
              <Card.Content className="p-4">
                <ImageInput
                  placeholder={t("dishDetail.imagePlaceholder")}
                  ratio="square"
                  value={selectedDish.imageUrl}
                  onChange={() => {}}
                />
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </form>
  );
};

export default DishDetail;
