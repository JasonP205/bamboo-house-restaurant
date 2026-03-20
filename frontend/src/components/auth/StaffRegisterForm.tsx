import { useTranslation } from "react-i18next";
import { z } from "zod";
import {
  Button,
  Label,
  InputGroup,
  Description,
  Spinner,
  ListBox,
  Select,
  type Key,
} from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MailAccount02Icon,
  TelephoneIcon,
  ViewIcon,
  ViewOffSlashIcon,
  LockKeyIcon,
  UserAccountIcon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const staffRegisterSchema = z.object({
  firstName: z.string().min(1, "Please enter a valid first name."),
  lastName: z.string().min(1, "Please enter a valid last name."),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number."),
  gender: z.enum(["male", "female", "other"], "Please select a valid gender."),
  securityCode: z
    .string()
    .min(6, "Invalid security code. Please enter the correct code to proceed."),
});
type StaffRegisterFormData = z.infer<typeof staffRegisterSchema>;

const StaffRegisterForm = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<StaffRegisterFormData>({
    resolver: zodResolver(staffRegisterSchema),
  });
  const { loading, staffRegister } = useAuthStore();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const onSubmit = (data: StaffRegisterFormData) => {
    staffRegister(data);
    reset();
  };

  return (
    <div className="min-h-68">
      <form
        className="w-full flex flex-col space-y-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 gap-3">
          <div className="flex flex-col">
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
                className="w-full"
                placeholder={t("managerPanel.registerForm.firstNameLabel")}
                {...register("firstName")}
              />
            </InputGroup>
            {errors.firstName && (
              <p className="text-danger text-sm">
                {t("managerPanel.registerForm.firstNameError")}
              </p>
            )}
          </div>
          <div className="flex flex-col">
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
                className="w-full"
                placeholder={t("managerPanel.registerForm.lastNameLabel")}
                {...register("lastName")}
              />
            </InputGroup>
            {errors.lastName && (
              <p className="text-danger text-sm">
                {t("managerPanel.registerForm.lastNameError")}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col mt-3">
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
              className="w-full"
              placeholder={t("managerPanel.registerForm.emailLabel")}
              {...register("email")}
            />
          </InputGroup>
          {errors.email && (
            <p className="text-danger text-sm">
              {t("managerPanel.registerForm.emailError")}
            </p>
          )}
        </div>
        <div className="flex flex-col mt-3">
          <Label htmlFor="phoneNumber">
            {t("managerPanel.registerForm.phoneNumberLabel")}
          </Label>
          <InputGroup className="mt-2">
            <InputGroup.Prefix>
              <HugeiconsIcon
                icon={TelephoneIcon}
                className="size-4 text-muted"
              />
            </InputGroup.Prefix>
            <InputGroup.Input
              id="phoneNumber"
              type="tel"
              className="w-full"
              placeholder={t("managerPanel.registerForm.phoneNumberLabel")}
              {...register("phoneNumber")}
            />
          </InputGroup>
          {errors.phoneNumber && (
            <p className="text-danger text-sm">
              {t("managerPanel.registerForm.phoneNumberError")}
            </p>
          )}
        </div>
        <div className="flex flex-col mt-3">
          <Select
            autoComplete="gender"
            onChange={(value) =>
              setValue("gender", value as "male" | "female" | "other", {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }
            placeholder={t("managerPanel.registerForm.genderPlaceholder")}
          >
            <Label>{t("managerPanel.registerForm.genderLabel")}</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover placement="top">
              <ListBox>
                <ListBox.Item id="male" textValue="Male">
                  {t("managerPanel.registerForm.genderOptions.male")}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="female" textValue="Female">
                  {t("managerPanel.registerForm.genderOptions.female")}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="other" textValue="Other">
                  {t("managerPanel.registerForm.genderOptions.other")}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
          {errors.gender && (
            <p className="text-danger text-sm">
              {t("managerPanel.registerForm.genderError")}
            </p>
          )}
        </div>
        <div className="flex flex-col mt-3">
          <Label htmlFor="securityCode">
            {t("managerPanel.registerForm.securityCodeLabel")}
          </Label>
          <InputGroup className="mt-2">
            <InputGroup.Prefix>
              <HugeiconsIcon icon={LockKeyIcon} className="size-4 text-muted" />
            </InputGroup.Prefix>
            <InputGroup.Input
              id="securityCode"
              type={passwordVisible ? "text" : "password"}
              className="w-full"
              placeholder={t("managerPanel.registerForm.securityCodeLabel")}
              {...register("securityCode")}
            />
            <InputGroup.Suffix
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              <HugeiconsIcon
                icon={passwordVisible ? ViewIcon : ViewOffSlashIcon}
                className="size-4 text-muted"
              />
            </InputGroup.Suffix>
          </InputGroup>
          {errors.securityCode && (
            <p className="text-danger text-sm">
              {t("managerPanel.registerForm.securityCodeError")}
            </p>
          )}
        </div>
        <Button isPending={loading} fullWidth type="submit">
          {loading ? (
            <>
              <Spinner size="sm" className="text-current" />
              {t("managerPanel.registerForm.submitButtonPending")}
            </>
          ) : (
            t("managerPanel.registerForm.submitButton")
          )}
        </Button>
        <span className="text-center text-sm text-muted">
          {t("managerPanel.registerForm.returnLoginPrompt")}{" "}
          <a href="/auth/login" className="text-accent hover:underline">
            {t("managerPanel.registerForm.returnLoginLink")}
          </a>
        </span>
      </form>
    </div>
  );
};

export default StaffRegisterForm;
