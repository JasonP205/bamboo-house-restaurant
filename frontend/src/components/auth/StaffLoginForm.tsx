import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Label, InputGroup, Description } from "@heroui/react";
import { Key, Eye, EyeSlash, Hashtag } from "@gravity-ui/icons";
import { useState } from "react";

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

  return (
    <div className="h-66">
      <form
        className="w-full flex flex-col space-y-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col">
          <Label>Staff Number</Label>
          <InputGroup className="mt-2">
            <InputGroup.Prefix>
              <Hashtag className="size-4 text-muted" />
            </InputGroup.Prefix>
            <InputGroup.Input
              autoComplete="staff-number"
              className="w-full"
              placeholder="Staff Number"
              {...register("staffNumber")}
            />
          </InputGroup>
          <Description className="mt-1">Enter your staff number provided by the manager</Description>
          {errors.staffNumber && (
            <p className="text-danger text-sm">{errors.staffNumber.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <Label>Password</Label>
          <InputGroup className="mt-2">
            <InputGroup.Prefix>
              <Key className="size-4 text-muted" />
            </InputGroup.Prefix>
            <InputGroup.Input
              className="w-full"
              placeholder="Password"
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
                  <Eye className="size-4 text-muted" />
                ) : (
                  <EyeSlash className="size-4 text-muted" />
                )}
              </Button>
            </InputGroup.Suffix>
          </InputGroup>
          {errors.password && (
            <p className="text-danger text-sm">{errors.password.message}</p>
          )}
          <div className="mt-2 flex justify-end">
            <a href="/auth/staff-forgot-password" className="text-sm text-accent hover:underline">
              Forgot password?
            </a>
          </div>
        </div>

        <Button fullWidth type="submit">
          Continue
        </Button>
      </form>
    </div>
  );
};

export default StaffLoginForm;
