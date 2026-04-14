import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Label,
  InputGroup,
  Description,
  Spinner,
  toast,
} from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ViewIcon,
  ViewOffSlashIcon,
  LockKeyIcon,
  Hashtag,
  Login02Icon,
} from "@hugeicons/core-free-icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import SeparatorOpt from "../ui/SeparatorOpt";
import { Icon } from "@iconify/react";

const staffLoginSchema = z.object({
  staffId: z.string().min(3, "Staff number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type StaffLoginFormData = z.infer<typeof staffLoginSchema>;
const StaffLoginForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StaffLoginFormData>({
    resolver: zodResolver(staffLoginSchema),
  });
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { t } = useTranslation(["auth"]);

  const onSubmit = async (data: StaffLoginFormData) => {
    try {
      await staffLogin(data);
      reset();
      toast.success(t("auth:toast.staff.login.success.title"), {
        description: t("auth:toast.staff.login.success.message"),
        timeout: 5000,
      });
    } catch (error) {
      toast.danger(t("auth:toast.staff.login.error.title"), {
        description: t("auth:toast.staff.login.error.message"),
        timeout: 5000,
      });
    }
  };

  const { staffLogin, loading, role } = useAuthStore();
  useEffect(() => {
    const handleEnterKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSubmit(onSubmit)();
      }
    };
    window.addEventListener("keydown", handleEnterKey);
    return () => {
      window.removeEventListener("keydown", handleEnterKey);
    };
  }, []);
  useEffect(() => {
    if (role === "manager") {
      navigate("/branches");
    } else if (role === "staff") {
      navigate("/orders");
    }
  }, [role, navigate]);

  return (
    <div className="min-h-68">
      <form
        className="w-full flex flex-col space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col">
          <Label>{t("loginForm.staff.staffNumberLabel")}</Label>
          <InputGroup className="mt-2">
            <InputGroup.Prefix>
              <HugeiconsIcon icon={Hashtag} className="size-4 text-muted" />
            </InputGroup.Prefix>
            <InputGroup.Input
              maxLength={10}
              autoComplete="staff-number"
              className="w-full"
              placeholder={t("loginForm.staff.staffNumberLabel")}
              {...register("staffId")}
            />
          </InputGroup>
          <Description className="mt-1">
            {t("loginForm.staff.staffNumberDescription")}
          </Description>
          {errors.staffId && (
            <p className="text-danger text-sm">
              {t("errors.login.staff.staffId")}
            </p>
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
              maxLength={50}
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
            <p className="text-danger text-sm">
              {t("errors.login.staff.password")}
            </p>
          )}
        </div>
        <Button fullWidth type="submit" isPending={loading}>
          {loading ? (
            <>
              <Spinner size="sm" className="text-current" />
              {t("loginForm.staff.submitButtonPending")}
            </>
          ) : (
            <>
              {t("loginForm.staff.submitButton")}{" "}
              <HugeiconsIcon icon={Login02Icon} className="size-6 text-white" />
            </>
          )}
        </Button>
        <SeparatorOpt value={t("loginForm.staff.or")} />
        <Button
          variant="outline"
          fullWidth
          onPress={() =>
            (window.location.href = `${import.meta.env.VITE_API_URL}/auth/oauth2/google`)
          }
          className="text-white"
        >
          <Icon icon="devicon:google" />
          <span>{t("loginForm.staff.loginWithGoogle")}</span>
        </Button>
      </form>
    </div>
  );
};

export default StaffLoginForm;
