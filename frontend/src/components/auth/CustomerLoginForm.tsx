import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Label, InputGroup, Description, Spinner } from "@heroui/react";
import { Envelope, Key, Eye, EyeSlash } from "@gravity-ui/icons";
import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

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

  return (
    <div className="h-66">
      <form
        className="w-full flex flex-col space-y-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col">
          <Label>Email address</Label>
          <InputGroup className="mt-2">
            <InputGroup.Prefix>
              <Envelope className="size-4 text-muted" />
            </InputGroup.Prefix>
            <InputGroup.Input
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
            <a
              href="/auth/forgot-password"
              className="text-sm text-accent hover:underline"
            >
              Forgot password?
            </a>
          </div>
        </div>
        <Button fullWidth type="submit" isPending={loading}>
          {loading ? (
            <>
              <Spinner className="size-4 text-white" />
              Pending...
            </>
          ) : (
            "Continue"
          )}
        </Button>
        <span className="text-center text-sm text-muted">
          Don't have an account?{" "}
          <a href="/auth/register" className="text-accent hover:underline">
            Sign up
          </a>
        </span>
      </form>
    </div>
  );
};

export default CustomerLoginForm;
