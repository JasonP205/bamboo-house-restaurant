import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Label, InputGroup, Description, Spinner } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MailAccount02Icon,
  ViewIcon,
  ViewOffSlashIcon,
  LockKeyIcon,
  CrownPlusIcon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import { toast } from "@heroui/react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const customerRegisterSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => {
    if (
      data.password !== data.confirmPassword &&
      data.password.length >= 6 &&
      data.confirmPassword.length >= 6
    ) {
      toast.danger("Password does not match!");
      return false;
    }
    return true;
  });
type CustomerRegisterFormData = z.infer<typeof customerRegisterSchema>;
const CustomerRegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerRegisterFormData>({
    resolver: zodResolver(customerRegisterSchema),
  });
  const navigate = useNavigate();
  const { customerRegister, loading } = useAuthStore();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const onSubmit = (data: CustomerRegisterFormData) => {
    const { confirmPassword, ...userInfo } = data;
    customerRegister(userInfo);
    navigate("/auth/login");
  };

  const { t } = useTranslation("auth");

  return (
    <div className="">
      <form
        className="w-full flex flex-col space-y-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 gap-3">
          <div className="flex flex-col">
            <Label htmlFor="firstName">
              {t("registerForm.firstNameLabel")}
            </Label>
            <InputGroup className="mt-2">
              <InputGroup.Input
                id="firstName"
                className="w-full"
                placeholder={t("registerForm.firstNameLabel")}
                {...register("firstName")}
              />
            </InputGroup>
            {errors.firstName && (
              <p className="text-danger text-sm">
                {t("errors.register.firstName")}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="lastName">{t("registerForm.lastNameLabel")}</Label>
            <InputGroup className="mt-2">
              <InputGroup.Input
                id="lastName"
                className="w-full"
                placeholder={t("registerForm.lastNameLabel")}
                {...register("lastName")}
              />
            </InputGroup>
            {errors.lastName && (
              <p className="text-danger text-sm">
                {t("errors.register.lastName")}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <Label htmlFor="email">{t("registerForm.emailLabel")}</Label>
          <InputGroup className="mt-2">
            <InputGroup.Prefix>
              <HugeiconsIcon
                icon={MailAccount02Icon}
                className="size-4 text-muted"
              />
            </InputGroup.Prefix>
            <InputGroup.Input
              id="email"
              autoComplete="email"
              className="w-full"
              placeholder="name@example.com"
              {...register("email")}
            />
          </InputGroup>
          <Description className="mt-1">
            {t("registerForm.emailDescription")}
          </Description>
          {errors.email && (
            <p className="text-danger text-sm">{t("errors.register.email")}</p>
          )}
        </div>
        <div className="flex flex-col">
          <Label htmlFor="password">{t("registerForm.passwordLabel")}</Label>
          <InputGroup className="mt-2">
            <InputGroup.Prefix>
              <HugeiconsIcon icon={LockKeyIcon} className="size-4 text-muted" />
            </InputGroup.Prefix>
            <InputGroup.Input
              id="password"
              className="w-full"
              placeholder={t("registerForm.passwordLabel")}
              autoComplete="password"
              type={passwordVisible ? "text" : "password"}
              {...register("password")}
            />
            <InputGroup.Suffix>
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? (
                  <HugeiconsIcon
                    icon={ViewIcon}
                    className="size-4 text-muted"
                  />
                ) : (
                  <HugeiconsIcon
                    icon={ViewOffSlashIcon}
                    className="size-4 text-muted"
                  />
                )}
              </Button>
            </InputGroup.Suffix>
          </InputGroup>
          {errors.password && (
            <p className="text-danger text-sm">
              {t("errors.register.password")}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <Label htmlFor="confirmPassword">
            {t("registerForm.confirmPasswordLabel")}
          </Label>
          <InputGroup className="mt-2">
            <InputGroup.Prefix>
              <HugeiconsIcon icon={LockKeyIcon} className="size-4 text-muted" />
            </InputGroup.Prefix>
            <InputGroup.Input
              id="confirmPassword"
              className="w-full"
              placeholder={t("registerForm.confirmPasswordLabel")}
              autoComplete="password"
              type={passwordVisible ? "text" : "password"}
              {...register("confirmPassword")}
            />
          </InputGroup>
          {errors.confirmPassword && (
            <p className="text-danger text-sm">
              {t("errors.register.confirmPassword")}
            </p>
          )}
        </div>
        <Button isPending={loading} fullWidth type="submit">
          {loading ? (
            <>
              <Spinner color="current" size="sm" />
              {t("registerForm.submitButtonPending")}
            </>
          ) : (
            <>
              <span className="flex items-center justify-center gap-2">
                {t("registerForm.submitButton")}
                <HugeiconsIcon
                  icon={CrownPlusIcon}
                  className="size-5 text-white"
                />
              </span>
            </>
          )}
        </Button>
        <span className="text-center text-sm text-muted">
          {t("registerForm.loginPrompt")}{" "}
          <a href="/auth/login" className="text-accent hover:underline">
            {t("registerForm.loginLink")}
          </a>
        </span>
      </form>
    </div>
  );
};

export default CustomerRegisterForm;
