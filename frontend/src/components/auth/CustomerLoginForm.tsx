import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Label, InputGroup, Description, Spinner } from "@heroui/react";
import { HugeiconsIcon} from "@hugeicons/react"
import {MailAccount02Icon, ViewIcon, ViewOffSlashIcon, LockKeyIcon} from "@hugeicons/core-free-icons"
import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTranslation } from "react-i18next";

const customerLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type CustomerLoginFormData = z.infer<typeof customerLoginSchema>;
const CustomerLoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerLoginFormData>({
    resolver: zodResolver(customerLoginSchema),
  });
  const { customerLogin, loading } = useAuthStore();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const onSubmit = (data: CustomerLoginFormData) => {
    customerLogin(data);
  };

  const { t } = useTranslation("auth");

  return (
    <div className="min-h-68">
      <form
        className="w-full flex flex-col space-y-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col">
          <Label>{t("loginForm.customer.emailLabel")}</Label>
          <InputGroup className="mt-2">
            <InputGroup.Prefix>
              <HugeiconsIcon icon={MailAccount02Icon} className="size-4 text-muted" />
            </InputGroup.Prefix>
            <InputGroup.Input
              autoComplete="email"
              className="w-full"
              placeholder="name@email.com"
              {...register("email")}
            />
          </InputGroup>
          <Description className="mt-1">
            {t("loginForm.customer.emailDescription")}
          </Description>
          {errors.email && (
            <p className="text-danger text-sm">{t("errors.login.customer.email")}</p>
          )}
        </div>
        <div className="flex flex-col">
          <Label>{t("loginForm.customer.passwordLabel")}</Label>
          <InputGroup className="mt-2">
            <InputGroup.Prefix>
              <HugeiconsIcon icon={LockKeyIcon} className="size-4 text-muted" />
            </InputGroup.Prefix>
            <InputGroup.Input
              className="w-full"
              placeholder={t("loginForm.customer.passwordLabel")}
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
                  <HugeiconsIcon icon={ViewIcon} className="size-4 text-muted" />
                ) : (
                  <HugeiconsIcon icon={ViewOffSlashIcon} className="size-4 text-muted" />
                )}
              </Button>
            </InputGroup.Suffix>
          </InputGroup>
          {errors.password && (
            <p className="text-danger text-sm">{t("errors.login.customer.password")}</p>
          )}
          <div className="mt-2 flex justify-end">
            <a
              href="/auth/forgot-password"
              className="text-sm text-accent hover:underline"
            >
              {t("loginForm.customer.forgotPassword")}
            </a>
          </div>
        </div>
        <Button fullWidth type="submit" isPending={loading}>
          {loading ? (
            <>
              <Spinner className="size-4 text-white" />
              {t("loginForm.customer.submitButtonPending")}
            </>
          ) : (
            t("loginForm.customer.submitButton")
          )}
        </Button>
        <span className="text-center text-sm text-muted">
          {t("loginForm.customer.registerPrompt")}{" "}
          <a href="/auth/register" className="text-accent hover:underline">
            {t("loginForm.customer.registerLink")}
          </a>
        </span>
      </form>
    </div>
  );
};

export default CustomerLoginForm;
