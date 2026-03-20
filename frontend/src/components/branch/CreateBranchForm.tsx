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
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useBranchStore } from "@/stores/useBranchStore";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, Image02Icon } from "@hugeicons/core-free-icons";
const createBranchSchema = z.object({
  name: z
    .string()
    .min(1, "Branch name is required")
    .max(100, "Branch name must be less than 100 characters"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(200, "Location must be less than 200 characters"),
  contactNumber: z
    .string()
    .min(1, "Contact number is required")
    .max(20, "Contact number must be less than 20 characters"),
  openingHours: z.object({
    open: z.string().min(1, "Opening time is required"),
    close: z.string().min(1, "Closing time is required"),
  }),
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const inputImageRef = useRef<HTMLInputElement | null>(null);

  const openingHours = {
    open: openingTime ? `${openingTime.toString()}` : "",
    close: closingTime ? `${closingTime.toString()}` : "",
  };
  const { t } = useTranslation(["branch"]);

  useEffect(() => {
    console.log("Opening Hours:", openingHours);
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
    if (Object.keys(errors).length > 0) {
      console.error("Form Errors:", errors);
    }
  }, [errors]);

  const { createBranch, loading } = useBranchStore();

  const onSubmit = async (data: CreateBranchFormData) => {
    try {
      console.log("Form Data:", data);
      await createBranch(data);
      reset();
      setPreviewUrl(null);
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
            className={`w-full aspect-video overflow-hidden rounded-lg flex items-center justify-center cursor-pointer transition 
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
              <img
                src={previewUrl}
                alt="Branch Preview"
                className="w-full h-full object-cover rounded-lg"
              />
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
        <Button fullWidth type="submit" className="" isPending={loading}>
          {loading ? (
            <>
              <Spinner size="sm" />
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
