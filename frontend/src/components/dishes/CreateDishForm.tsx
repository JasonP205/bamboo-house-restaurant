import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Label,
  InputGroup,
  TextField,
  FieldError,
  Description,
  Spinner,
} from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import SelectField from "../common/SelectField";
import { SparklesIcon } from "@hugeicons/core-free-icons";
import { useTranslation } from "react-i18next";
import ImageInput from "../common/ImageInput";
import NumberInput from "../common/NumberInput";
import { useEffect, useState } from "react";
import { useBranchStore } from "@/stores/useBranchStore";

interface CreateDishFormProps {
  onSubmit?: (data: DishFormData) => void;
  onClose?: () => void;
  loading: boolean;
}

const dishSchema = z.object({
  name: z.object({
    en: z.string().min(1, "English name is required"),
    vi: z.string().min(1, "Vietnamese name is required"),
  }),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description is required"),
  price: z.number().positive("Price must be a positive number"),
  image: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Image must be less than 5MB",
    ),
  dietary: z.array(z.string()).optional(),
});

export type DishFormData = z.infer<typeof dishSchema>;

const CreateDishForm = ({
  onSubmit,
  onClose,
  loading,
}: CreateDishFormProps) => {
  const { t } = useTranslation(["dishes"]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<DishFormData>({
    resolver: zodResolver(dishSchema),
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
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const handleDietaryChange = (values: string[]) => {
    setSelectedDietary(values);
    setValue("dietary", values, { shouldValidate: true, shouldDirty: true });
  };
  const onSubmitHandler = (data: DishFormData) => {
    if (errors) {
      console.log("Validation errors:", errors);
    }
    onSubmit?.(data);
  };
  return (
    <div className="p-2 w-full">
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="space-y-4 grid grid-cols-1 md:grid-cols-3 gap-4 w-full"
      >
        <div className="w-full flex flex-col md:col-span-1 gap-4">
          <ImageInput
            label={t("createDish.form.label.image")}
            placeholder={t("createDish.form.placeholder.image")}
            onChange={(file) =>
              setValue("image", file, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            className="max-w-xs"
            isInvalid={!!errors.image}
            errorMessage={t("createDish.form.validation.image")}
            ratio="square"
            classNames={{
              label: "uppercase text-text tracking-wider",
            }}
          />
          <div className="bg-warning/30 p-4 rounded-xl flex gap-4 items-start">
            <div className="w-5 h-5 text-text">
              <HugeiconsIcon icon={SparklesIcon} size={24} />
            </div>
            <div>
              <p className="text-text text-xs font-light leading-relaxed">
                <strong className="block font-serif">
                  {t("createDish.form.tip.title")}:
                </strong>
                {t("createDish.form.tip.content")}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full md:col-span-2 flex flex-col gap-4">
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
                  placeholder={t("createDish.form.placeholder.name.en")}
                  {...register("name.en")}
                />
              </InputGroup>
              <FieldError>{t("createDish.form.validation.name.en")}</FieldError>
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
                  id="name-vi"
                  placeholder={t("createDish.form.placeholder.name.vi")}
                  {...register("name.vi")}
                />
              </InputGroup>
              <FieldError>{t("createDish.form.validation.name.vi")}</FieldError>
            </TextField>
          </div>
          <TextField isInvalid={!!errors.description} fullWidth>
            <Label
              htmlFor="description"
              className="uppercase text-text tracking-wider"
            >
              {t("createDish.form.label.description")}
            </Label>
            <InputGroup fullWidth>
              <InputGroup.TextArea
                id="description"
                className={`resize-none`}
                maxLength={500}
                rows={6}
                placeholder={t("createDish.form.placeholder.description")}
                {...register("description")}
              />
            </InputGroup>
            <FieldError>
              {t("createDish.form.validation.description")}
            </FieldError>
            <Description className="text-muted text-xs text-balance">
              {t("createDish.form.label.descriptionHelper")}
            </Description>
          </TextField>
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <NumberInput
              label={t("createDish.form.label.price")}
              onChange={(value) =>
                setValue("price", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              value={0}
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
              isInvalid={!!errors.category}
              errorMessage={t("createDish.form.validation.category")}
              placeholder={t("createDish.form.placeholder.category")}
              selectOptions={[
                {
                  value: "appetizer",
                  label: t("createDish.form.label.categoryValues.appetizer"),
                },
                {
                  value: "main",
                  label: t("createDish.form.label.categoryValues.main"),
                },
                {
                  value: "beverage",
                  label: t("createDish.form.label.categoryValues.beverage"),
                },
                {
                  value: "merchandise",
                  label: t("createDish.form.label.categoryValues.merchandise"),
                }
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
                        ? selectedDietary.filter((v) => v !== option.value)
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
        </div>
        <div className="w-full flex justify-end gap-2 col-span-3">
          <Button isDisabled={loading} variant="outline" onClick={onClose}>
            {t("createDish.form.cancelButton")}
          </Button>
          <Button type="submit" isPending={loading}>
            {loading ? (
              <>
                <Spinner size="sm" className="text-current" />{" "}
                {t("createDish.form.submitButtonLoading")}
              </>
            ) : (
              t("createDish.form.submitButton")
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateDishForm;
