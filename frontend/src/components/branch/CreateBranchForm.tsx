import {  z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import {
  Button,
  InputGroup,
  Label,
  TimeField,
  type TimeValue,
  Spinner,
  toast,
  NumberField,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useBranchStore } from "@/stores/useBranchStore";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon } from "@hugeicons/core-free-icons";
import ImageInput from "../common/ImageInput";
const createBranchSchema = z.object({
  name: z
    .string()
    .min(1, "Branch name is required")
    .max(100, "Branch name must be less than 100 characters"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(200, "Location must be less than 200 characters"),
  mapCoordinates: z
    .string()
    .min(1, "Map coordinates are required")
    .max(500, "Map coordinates must be less than 500 characters"),
  contactNumber: z
    .string()
    .min(1, "Contact number is required")
    .max(20, "Contact number must be less than 20 characters"),
  openingHours: z.object({
    open: z.string().min(1, "Opening time is required"),
    close: z.string().min(1, "Closing time is required"),
  }),
  floorSpace: z
    .number()
    .min(0, "Floor space cannot be negative")
    .max(10000, "Floor space must be less than 10,000"),
  image: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Image must be less than 5MB",
    )
    .optional(),
});

type CreateBranchFormData = z.infer<typeof createBranchSchema>;

const CreateBranchForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateBranchFormData>({
    resolver: zodResolver(createBranchSchema),
  });
  const [openingTime, setOpeningTime] = useState<TimeValue | null>(null);
  const [closingTime, setClosingTime] = useState<TimeValue | null>(null);

  const openingHours = {
    open: openingTime ? `${openingTime.toString()}` : "",
    close: closingTime ? `${closingTime.toString()}` : "",
  };
  const { t } = useTranslation(["branch"]);

  useEffect(() => {
    console.log("Opening Hours:", openingHours);
    setValue("openingHours", openingHours);
  }, [openingTime, closingTime]);


  useEffect(() => {
    if (Object.keys(errors).length < 1) return;
    if (errors.name) {
      toast.danger(t("createBranchForm.validation.nameRequired"));
    } else if (errors.location) {
      toast.danger(t("createBranchForm.validation.locationRequired"));
    } else if (errors.contactNumber) {
      toast.danger(t("createBranchForm.validation.contactNumberRequired"));
    } else if (errors.openingHours?.open) {
      toast.danger(t("createBranchForm.validation.openingHoursRequired"));
    } else if (errors.openingHours?.close) {
      toast.danger(t("createBranchForm.validation.closingHoursRequired"));
    } else if (errors.floorSpace) {
      toast.danger(t("createBranchForm.validation.floorSpaceRequired"));
    } else if (errors.image) {
      toast.danger(t("createBranchForm.validation.imageRequired"));
    } 
  }, [errors]);

  const { createBranch, loadingCreatingBranch } = useBranchStore();

  const onSubmit = async (data: CreateBranchFormData) => {
    try {
      console.log("Form Data:", data);
      await createBranch(data);
      reset();
      toast.success(t("createBranchForm.toast.success.title"), {
        description: t("createBranchForm.toast.success.description"),
        timeout: 4000,
      });
    } catch (error) {
      console.error("Error creating branch:", error);
      toast.danger(t("createBranchForm.toast.error.title"), {
        description: t("createBranchForm.toast.error.description"),
        timeout: 4000,
      });
    }
  };

  return (
    <div className="w-full max-w-md mt-6">
      <form
        className="flex flex-col gap-4 p-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <ImageInput
          label={t("createBranchForm.imageLabel")}
          placeholder={t("createBranchForm.imagePlaceholder")}
          onChange={(file) => setValue("image", file)}
        />
        {/* Branch Name */}
        <div className="flex flex-col space-y-2">
          <Label>{t("createBranchForm.branchNameLabel")}</Label>
          <InputGroup>
            <InputGroup.Input
              type="text"
              placeholder={t("createBranchForm.branchNamePlaceholder")}
              {...register("name")}
            />
          </InputGroup>
        </div>
        {/* Location */}
        <div className="flex flex-col space-y-2">
          <Label>{t("createBranchForm.branchAddressLabel")}</Label>
          <InputGroup>
            <InputGroup.Input
              type="text"
              placeholder={t("createBranchForm.branchAddressPlaceholder")}
              {...register("location")}
            />
          </InputGroup>
        </div>
        {/* Map URL */}
        <div className="flex flex-col space-y-2">
          <Label>{t("createBranchForm.mapUrlLabel")}</Label>
          <InputGroup>
            <InputGroup.Input
              type="text"
              placeholder={t("createBranchForm.mapUrlPlaceholder")}
              {...register("mapCoordinates")}
            />
          </InputGroup>
        </div>
        {/* Contact Number */}
        <div className="flex flex-col space-y-2">
          <Label>{t("createBranchForm.phoneNumberLabel")}</Label>
          <InputGroup>
            <InputGroup.Input
              type="text"
              placeholder={t("createBranchForm.phoneNumberPlaceholder")}
              {...register("contactNumber")}
            />
          </InputGroup>
        </div>
        <div className="flex flex-col space-y-2">
          <NumberField defaultValue={0} fullWidth name="floorSpace" step={50} minValue={0} maxValue={10000} onChange={(value) => setValue("floorSpace", value)}>
            <Label>{t("createBranchForm.floorSpaceLabel")}</Label>
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input/>
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
        </div>
        {/* Opening Hours */}
        <div className="flex flex-row gap-4">
          <TimeField
            fullWidth
            name="time"
            value={openingTime}
            hourCycle={24}
            onChange={setOpeningTime}
          >
            <Label>{t("createBranchForm.openingHoursLabel")}</Label>
            <TimeField.Group>
              <TimeField.Prefix>
                <HugeiconsIcon
                  size={16}
                  icon={Clock01Icon}
                  className="text-muted"
                />
              </TimeField.Prefix>
              <TimeField.Input>
                {(segment) => <TimeField.Segment segment={segment} />}
              </TimeField.Input>
            </TimeField.Group>
          </TimeField>
          <TimeField
            fullWidth
            name="time"
            value={closingTime}
            hourCycle={24}
            onChange={setClosingTime}
          >
            <Label>{t("createBranchForm.closingHoursLabel")}</Label>
            <TimeField.Group>
              <TimeField.Prefix>
                <HugeiconsIcon
                  size={16}
                  icon={Clock01Icon}
                  className="text-muted"
                />
              </TimeField.Prefix>
              <TimeField.Input>
                {(segment) => <TimeField.Segment segment={segment} />}
              </TimeField.Input>
            </TimeField.Group>
          </TimeField>
        </div>
        <div className="flex flex-col space-y-2"></div>
        <Button fullWidth type="submit" className="" isPending={loadingCreatingBranch}>
          {loadingCreatingBranch ? (
            <>
              <Spinner className="text-muted" size="sm" />
              {t("createBranchForm.submitButtonPending")}
            </>
          ) : (
            t("createBranchForm.submitButton")
          )}
        </Button>
      </form>
    </div>
  );
};

export default CreateBranchForm;
