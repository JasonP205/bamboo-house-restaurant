import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useRef } from "react";
import {
  Button,
  InputGroup,
  Label,
  TimeField,
  type TimeValue,
  Spinner,
  toast,
  NumberField,
  useOverlayState,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useBranchStore } from "@/stores/useBranchStore";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, Image02Icon } from "@hugeicons/core-free-icons";
import { Time } from "@internationalized/date";

const editBranchSchema = z.object({
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

type EditBranchFormData = z.infer<typeof editBranchSchema>;

const EditBranchForm = ({
  state,
}: {
  state: ReturnType<typeof useOverlayState>;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EditBranchFormData>({
    resolver: zodResolver(editBranchSchema),
  });
  const { editBranch, loadingEditBranch, selectedBranch, selectedBranchId } =
    useBranchStore();
  if (!selectedBranchId || !selectedBranch) return null;

  const formatTimeString = (timeStr: string) => {
    const [hours, minutes, seconds = 0] = timeStr.split(":").map(Number);
    return new Time(hours, minutes, seconds);
  };

  const [openingTime, setOpeningTime] = useState<TimeValue | null>(
    formatTimeString(selectedBranch.openingHours.open),
  );
  const [closingTime, setClosingTime] = useState<TimeValue | null>(
    formatTimeString(selectedBranch.openingHours.close),
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    selectedBranch.imageUrl || null,
  );
  const [isDragging, setIsDragging] = useState(false);

  const inputImageRef = useRef<HTMLInputElement | null>(null);

  const openingHours = {
    open: openingTime ? `${openingTime.toString()}` : "",
    close: closingTime ? `${closingTime.toString()}` : "",
  };
  const { t } = useTranslation(["branch"]);

  useEffect(() => {
    setValue("openingHours", openingHours);
  }, [openingTime, closingTime]);

  const handleImageClick = () => {
    inputImageRef.current?.click();
  };

  const handlePreviewImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) previewFile(file);
  };

  const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      setValue("image", file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      previewFile(file);
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length < 1) return;
    if (errors.name) {
      toast.danger(t("createBranchForm.validation.nameRequired"));
    } else if (errors.location) {
      toast.danger(t("createBranchForm.validation.locationRequired"));
    } else if (errors.mapCoordinates) {
      toast.danger(t("createBranchForm.validation.mapCoordinatesRequired"));
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

  useEffect(() => {
    setValue("floorSpace", Number(selectedBranch.floorSpace) || 0);
  }, [selectedBranch.floorSpace]);

  const onSubmit = async (data: EditBranchFormData) => {
    try {
      await editBranch(data);
      reset();
      setPreviewUrl(null);
      state.close();
      toast.success(t("editBranch.toast.success.title"), {
        description: t("editBranch.toast.success.message"),
        timeout: 4000,
      });
    } catch (error) {
      console.error("Error creating branch:", error);
      toast.danger(t("editBranch.toast.error.title"), {
        description: t("editBranch.toast.error.message"),
        timeout: 4000,
      });
    }
  };

  return (
    <div className="w-full mt-6">
      <form
        className="flex flex-col gap-4 p-2 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col space-y-2">
          <Label>{t("createBranchForm.imageLabel")}</Label>

          <div
            onClick={handleImageClick}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`w-full relative aspect-video overflow-hidden rounded-lg flex items-center group justify-center cursor-pointer transition 
      ${isDragging ? "brightness-125 bg-surface-secondary" : ""}`}
          >
            <input
              hidden
              ref={inputImageRef}
              type="file"
              accept="image/*"
              onChange={handlePreviewImage}
            />

            {previewUrl ? (
              <>
                <img
                  src={previewUrl}
                  alt="Branch Preview"
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-smooth duration-500"
                />
                <div className="absolute z-40 inset-0 w-full h-full flex items-center flex-col justify-center rounded-lg bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-smooth duration-300">
                  <HugeiconsIcon
                    size={32}
                    icon={Image02Icon}
                    className="text-white"
                  />
                  <p className="text-white">
                    {t("createBranchForm.imagePlaceholder")}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex w-full h-full justify-center rounded-xl flex-col border-3 border-dashed items-center gap-2 text-muted">
                <HugeiconsIcon size={40} icon={Image02Icon} />
                <p>{t("createBranchForm.imagePlaceholder")}</p>
              </div>
            )}
          </div>
        </div>
        {/* Branch Name */}
        <div className="flex flex-col space-y-2">
          <Label>{t("createBranchForm.branchNameLabel")}</Label>
          <InputGroup>
            <InputGroup.Input
              type="text"
              defaultValue={selectedBranch.name}
              className="capitalize"
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
              defaultValue={selectedBranch.location}
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
              defaultValue={selectedBranch.mapCoordinates}
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
              defaultValue={selectedBranch.contactNumber}
              placeholder={t("createBranchForm.phoneNumberPlaceholder")}
              {...register("contactNumber")}
            />
          </InputGroup>
        </div>
        <div className="flex flex-col space-y-2">
          <NumberField
            defaultValue={Number(selectedBranch.floorSpace) || 0}
            fullWidth
            name="floorSpace"
            step={50}
            minValue={0}
            maxValue={10000}
            onChange={(value) => setValue("floorSpace", value)}
          >
            <Label>{t("createBranchForm.floorSpaceLabel")}</Label>
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input />
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
        <Button fullWidth type="submit" className="" isPending={loadingEditBranch}>
          {loadingEditBranch ? (
            <>
              <Spinner size="sm" />
              {t("editBranch.submitButtonPending")}
            </>
          ) : (
            t("editBranch.submitButton")
          )}
        </Button>
      </form>
    </div>
  );
};

export default EditBranchForm;
