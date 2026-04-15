import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Breadcrumbs,
  Button,
  Card,
  Description,
  FieldError,
  InputGroup,
  Label,
  Spinner,
  TextField,
  toast,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import type { Staff } from "@/types/auth";
import SelectField from "@/components/common/SelectField";
import { staffService, type UpdateStaffPayload } from "@/services/staffService";

const staffProfileSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  email: z.string().email("Invalid email"),
  gender: z.enum(["male", "female", "other"]),
  dateOfJoining: z.string().min(1, "Date of joining is required"),
});

type StaffProfileFormData = z.infer<typeof staffProfileSchema>;

const StaffProfilePage = () => {
  const { t } = useTranslation(["branch", "common"]);
  const { staffId } = useParams();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [staff, setStaff] = useState<Staff | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<StaffProfileFormData>({
    resolver: zodResolver(staffProfileSchema),
    defaultValues: {
      displayName: "",
      email: "",
      gender: "other",
      dateOfJoining: "",
    },
  });

  useEffect(() => {
    const fetchStaff = async () => {
      if (!staffId) return;
      try {
        setLoading(true);
        const staffDetail = await staffService.fetchStaffById(staffId);
        setStaff(staffDetail);
        reset({
          displayName: staffDetail.displayName || "",
          email: staffDetail.email || "",
          gender: staffDetail.gender || "other",
          dateOfJoining: staffDetail.dateOfJoining
            ? new Date(staffDetail.dateOfJoining).toISOString().split("T")[0]
            : "",
        });
      } catch (error) {
        console.error("Error fetching staff profile:", error);
        toast.danger(t("branch:staffProfile.toast.fetchFailed"));
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [staffId, reset, t]);

  const onSubmit = async (data: StaffProfileFormData) => {
    if (!staffId) return;

    try {
      setSaving(true);
      const payload: UpdateStaffPayload = {
        displayName: data.displayName,
        email: data.email,
        gender: data.gender,
        dateOfJoining: data.dateOfJoining,
      };

      const updatedStaff = await staffService.updateStaffById(staffId, payload);
      setStaff(updatedStaff);
      reset({
        displayName: updatedStaff.displayName || "",
        email: updatedStaff.email || "",
        gender: updatedStaff.gender || "other",
        dateOfJoining: updatedStaff.dateOfJoining
          ? new Date(updatedStaff.dateOfJoining).toISOString().split("T")[0]
          : "",
      });
      toast.success(t("branch:staffProfile.toast.updateSuccess"));
    } catch (error) {
      console.error("Error updating staff profile:", error);
      toast.danger(t("branch:staffProfile.toast.updateFailed"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10">
        <p className="text-muted">{t("branch:staffProfile.loading")}</p>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="p-10">
        <p className="text-muted">{t("branch:staffProfile.notFound")}</p>
      </div>
    );
  }

  return (
    <div className="w-full p-10 flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item>
          <Link to="/branches">{t("common:staffNavItems.branches")}</Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <span>{staff.displayName}</span>
        </Breadcrumbs.Item>
      </Breadcrumbs>
      <div>
        <h1 className="text-3xl font-serif italic text-accent">
          {t("staffProfile.title")}
        </h1>
        <Description className="text-muted">
          {t("staffProfile.description")}
        </Description>
      </div>
      <div className="flex gap-4 w-full">
        <Card className="max-w-3xl flex-1">
          <Card.Content>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <TextField isInvalid={!!errors.displayName} fullWidth>
                <Label>{t("staffProfile.form.displayName")}</Label>
                <InputGroup>
                  <InputGroup.Input {...register("displayName")} />
                </InputGroup>
                <FieldError>{errors.displayName?.message}</FieldError>
              </TextField>

              <TextField isInvalid={!!errors.email} fullWidth>
                <Label>{t("staffProfile.form.email")}</Label>
                <InputGroup>
                  <InputGroup.Input type="email" {...register("email")} />
                </InputGroup>
                <FieldError>{errors.email?.message}</FieldError>
              </TextField>

              <SelectField
                label={t("staffProfile.form.gender")}
                fullWidth
                value={watch("gender")}
                isInvalid={!!errors.gender}
                errorMessage={errors.gender?.message}
                onSelect={(value) =>
                  setValue("gender", value as "male" | "female" | "other", {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                selectOptions={[
                  {
                    value: "male",
                    label: t("common:staff.genderValue.male"),
                  },
                  {
                    value: "female",
                    label: t("common:staff.genderValue.female"),
                  },
                  {
                    value: "other",
                    label: t("common:staff.genderValue.other"),
                  },
                ]}
              />

              <TextField isInvalid={!!errors.dateOfJoining} fullWidth>
                <Label>{t("staffProfile.form.dateOfJoining")}</Label>
                <InputGroup>
                  <InputGroup.Input
                    type="date"
                    {...register("dateOfJoining")}
                  />
                </InputGroup>
                <FieldError>{errors.dateOfJoining?.message}</FieldError>
              </TextField>

              <Button
                className="self-end"
                type="submit"
                variant="primary"
                isPending={saving}
              >
                {saving ? (
                  <>
                    <Spinner />
                  </>
                ) : (
                  t("staffProfile.form.save")
                )}
              </Button>
            </form>
          </Card.Content>
        </Card>
        <img
          src={staff.avatarUrl}
          alt={staff.displayName}
          className="w-50 h-50 rounded-xl object-cover mt-4"
        />
      </div>
    </div>
  );
};

export default StaffProfilePage;
