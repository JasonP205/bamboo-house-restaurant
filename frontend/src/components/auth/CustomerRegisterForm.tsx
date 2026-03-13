import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Label, InputGroup, Description, Spinner } from "@heroui/react";
import { Envelope, Key, Eye, EyeSlash } from "@gravity-ui/icons";
import { useState } from "react";
import { toast } from "@heroui/react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="">
      <form
        className="w-full flex flex-col space-y-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 gap-3">
          <div className="flex flex-col">
            <Label htmlFor="firstName">First Name</Label>
            <InputGroup className="mt-2">
              <InputGroup.Input
                id="firstName"
                className="w-full"
                placeholder="First Name"
                {...register("firstName")}
              />
            </InputGroup>
            {errors.firstName && (
              <p className="text-danger text-sm">{errors.firstName.message}</p>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="lastName">Last Name</Label>
            <InputGroup className="mt-2">
              <InputGroup.Input
                id="lastName"
                className="w-full"
                placeholder="Last Name"
                {...register("lastName")}
              />
            </InputGroup>
            {errors.lastName && (
              <p className="text-danger text-sm">{errors.lastName.message}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <Label htmlFor="email">Email address</Label>
          <InputGroup className="mt-2">
            <InputGroup.Prefix>
              <Envelope className="size-4 text-muted" />
            </InputGroup.Prefix>
            <InputGroup.Input
              id="email"
              autoComplete="email"
              className="w-full"
              placeholder="name@email.com"
              {...register("email")}
            />
          </InputGroup>
          <Description className="mt-1">
            We'll never share this with anyone else
          </Description>
          {errors.email && (
            <p className="text-danger text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <Label htmlFor="password">Password</Label>
          <InputGroup className="mt-2">
            <InputGroup.Prefix>
              <Key className="size-4 text-muted" />
            </InputGroup.Prefix>
            <InputGroup.Input
              id="password"
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
        </div>
        <div className="flex flex-col">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <InputGroup className="mt-2">
            <InputGroup.Prefix>
              <Key className="size-4 text-muted" />
            </InputGroup.Prefix>
            <InputGroup.Input
              id="confirmPassword"
              className="w-full"
              placeholder="Confirm Password"
              autoComplete="password"
              type={passwordVisible ? "text" : "password"}
              {...register("confirmPassword")}
            />
          </InputGroup>
          {errors.confirmPassword && (
            <p className="text-danger text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <Button isPending={loading} fullWidth type="submit">
          {loading ? (
            <>
              <Spinner color="current" size="sm" />
              Registering...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
        <span className="text-center text-sm">
          Already have an account?{" "}
          <a href="/auth/login" className="text-accent hover:underline">
            Log in
          </a>{" "}
          now!
        </span>
      </form>
    </div>
  );
};

export default CustomerRegisterForm;
