import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Label, InputGroup, Description } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ViewIcon,
  ViewOffSlashIcon,
  LockKeyIcon,
  Hashtag,
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const staffLoginSchema = z.object({
  staffNumber: z.string().min(3, "Staff number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type StaffLoginFormData = z.infer<typeof staffLoginSchema>;
const StaffLoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffLoginFormData>({
    resolver: zodResolver(staffLoginSchema),
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const onSubmit = (data: StaffLoginFormData) => {
    console.log(data);
  };
  const { t } = useTranslation("auth");

  return (
    <div className="min-h-68">
      <form
        className="w-full flex flex-col space-y-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col">
          <Label>{t("loginForm.staff.staffNumberLabel")}</Label>
          <InputGroup className="mt-2">
            <InputGroup.Prefix>
              <HugeiconsIcon icon={Hashtag} className="size-4 text-muted" />
            </InputGroup.Prefix>
            <InputGroup.Input
              autoComplete="staff-number"
              className="w-full"
              placeholder={t("loginForm.staff.staffNumberLabel")}
              {...register("staffNumber")}
            />
          </InputGroup>
          <Description className="mt-1">
            {t("loginForm.staff.staffNumberDescription")}
          </Description>
          {errors.staffNumber && (
            <p className="text-danger text-sm">{t("errors.login.staff.staffNumber")}</p>
          )}
        </div>
        <div className="flex flex-col">
          <Label>{t("loginForm.staff.passwordLabel")}</Label>
          <InputGroup className="mt-2">
            <InputGroup.Prefix>
              <HugeiconsIcon icon={LockKeyIcon} className="size-4 text-muted" />
            </InputGroup.Prefix>
            <InputGroup.Input
              className="w-full"
              placeholder={t("loginForm.staff.passwordLabel")}
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
            <p className="text-danger text-sm">{t("errors.login.staff.password")}</p>
          )}
          <div className="mt-2 flex justify-end">
            <a
              href="/auth/staff-forgot-password"
              className="text-sm text-accent hover:underline"
            >
              {t("loginForm.staff.forgotPassword")}
            </a>
          </div>
        </div>

        <Button fullWidth type="submit">
          {t("loginForm.staff.submitButton")}
        </Button>
      </form>
    </div>
  );
};

export default StaffLoginForm;
