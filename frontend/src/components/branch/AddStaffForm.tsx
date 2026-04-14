import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Label,
  Button,
  InputGroup,
  FieldError,
  Spinner,
  toast,
  Description,
} from "@heroui/react";
import ImageInput from "../common/ImageInput";
import SelectField from "../common/SelectField";
import { useTranslation } from "react-i18next";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  MailAccount02Icon,
  UserAccountIcon,
} from "@hugeicons/core-free-icons";
import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";

// ✅ schema dùng i18n
const useAddStaffSchema = () => {
  const { t } = useTranslation("auth");

  return z.object({
    firstName: z.string().min(1, t("managerPanel.registerForm.firstNameError")),
    lastName: z.string().min(1, t("managerPanel.registerForm.lastNameError")),
    email: z.string().email(t("managerPanel.registerForm.emailError")),
    gender: z.string().min(1, t("managerPanel.registerForm.genderError")),
    avatar: z
      .instanceof(File)
      .refine(
        (file) => file.size <= 5 * 1024 * 1024,
        t("managerPanel.registerForm.avatarSizeError"),
      ),
  });
};

export type AddStaffFormData = z.infer<ReturnType<typeof useAddStaffSchema>>;

const AddStaffForm = () => {
  const { t } = useTranslation("auth");
  const schema = useAddStaffSchema();
  const [staffId, setStaffId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<AddStaffFormData>({
    resolver: zodResolver(schema),
  });

  const { staffRegister, loading } = useAuthStore();

  const onSubmit = async (data: AddStaffFormData) => {
    try {
      const result = await staffRegister(data);
      setStaffId(result);
      toast.success(t("managerPanel.toast.success.title"), {
        description: t("managerPanel.toast.success.message"),
        timeout: 5000,
      });
    } catch (error) {
      toast.danger(t("toast.staff.register.error.title"), {
        description: t("toast.staff.register.error.message"),
        timeout: 5000,
      });
      console.error("Error registering staff:", error);
    }
  };

  return (
    <div className="w-full p-2">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {staffId && (
          <div className="rounded-xl p-4 border border-success shadow-md shadow-success-soft bg-success/10 text-success mt-4">
            <div className="flex items-center gap-1 mb-2">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} />
              <p>{t("managerPanel.registerForm.successNoti")}</p>
            </div>
            <p>
              {t("managerPanel.registerForm.newStaffId")}{" "}<strong>{staffId}</strong>
            </p>
            <Description className="text-muted text-balance">
              {t("managerPanel.registerForm.newStaffIdDescription")}
            </Description>
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Avatar */}
          <div className="w-1/4">
            <ImageInput
              label={t("managerPanel.registerForm.avatarLabel")}
              onChange={(file) =>
                setValue("avatar", file, { shouldValidate: true })
              }
              errorMessage={t("managerPanel.registerForm.avatarError")}
              isInvalid={!!errors.avatar}
              placeholder={t("managerPanel.registerForm.avatarPlaceholder")}
              ratio="square"
            />
          </div>

          {/* Form fields */}
          <div className="w-3/4">
            {/* First + Last name */}
            <div className="flex flex-col md:flex-row gap-3">
              <TextField
                isInvalid={!!errors.firstName}
                className="flex flex-col w-full"
              >
                <Label htmlFor="firstName">
                  {t("managerPanel.registerForm.firstNameLabel")}
                </Label>
                <InputGroup className="mt-2">
                  <InputGroup.Prefix>
                    <HugeiconsIcon
                      icon={UserAccountIcon}
                      className="size-4 text-muted"
                    />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    id="firstName"
                    placeholder={t("managerPanel.registerForm.firstNameLabel")}
                    {...register("firstName")}
                  />
                </InputGroup>
                <FieldError>
                  {t("managerPanel.registerForm.firstNameError")}
                </FieldError>
              </TextField>

              <TextField
                isInvalid={!!errors.lastName}
                className="flex flex-col w-full"
              >
                <Label htmlFor="lastName">
                  {t("managerPanel.registerForm.lastNameLabel")}
                </Label>
                <InputGroup className="mt-2">
                  <InputGroup.Prefix>
                    <HugeiconsIcon
                      icon={UserAccountIcon}
                      className="size-4 text-muted"
                    />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    id="lastName"
                    placeholder={t("managerPanel.registerForm.lastNameLabel")}
                    {...register("lastName")}
                  />
                </InputGroup>
                <FieldError>
                  {t("managerPanel.registerForm.lastNameError")}
                </FieldError>
              </TextField>
            </div>

            {/* Email */}
            <div className="flex flex-col mt-3">
              <TextField isInvalid={!!errors.email} className="flex flex-col">
                <Label htmlFor="email">
                  {t("managerPanel.registerForm.emailLabel")}
                </Label>
                <InputGroup className="mt-2">
                  <InputGroup.Prefix>
                    <HugeiconsIcon
                      icon={MailAccount02Icon}
                      className="size-4 text-muted"
                    />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    id="email"
                    type="email"
                    placeholder={t("managerPanel.registerForm.emailLabel")}
                    {...register("email")}
                  />
                </InputGroup>
                <FieldError>
                  {t("managerPanel.registerForm.emailError")}
                </FieldError>
              </TextField>
            </div>

            {/* Gender */}
            <div className="mt-3">
              <SelectField
                isInvalid={!!errors.gender}
                errorMessage={t("managerPanel.registerForm.genderError")}
                label={t("managerPanel.registerForm.genderLabel")}
                selectOptions={[
                  {
                    value: "male",
                    label: t("managerPanel.registerForm.genderOptions.male"),
                  },
                  {
                    value: "female",
                    label: t("managerPanel.registerForm.genderOptions.female"),
                  },
                  {
                    value: "other",
                    label: t("managerPanel.registerForm.genderOptions.other"),
                  },
                ]}
                placeholder={t("managerPanel.registerForm.genderPlaceholder")}
                onSelect={(value) =>
                  setValue("gender", value as "male" | "female" | "other", {
                    shouldValidate: true,
                  })
                }
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row self-end gap-4">
          <Button slot="close" isDisabled={isSubmitting} variant="outline">
            {t("managerPanel.registerForm.cancelButton")}
          </Button>
          <Button type="submit" variant="primary" isPending={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner className="text-muted" size="sm"  />
                {t("managerPanel.registerForm.submitButtonPending")}
              </>
            ) : (
              t("managerPanel.registerForm.submitButton")
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddStaffForm;
