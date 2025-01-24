import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { useForm, SubmitHandler, FieldErrors, Controller } from "react-hook-form";
import { useSignin } from "../../user/hooks/use.auth";
import { showToast } from "@repo/ui/components/ui/toaster";
import { AuthFormWrapper } from "./AuthFormWrapper";
import { SignInFormData } from "@repo/data/types";
import { signInResolver } from "@repo/zod/resolver";
import { getErrorMessage } from "../../../../utils/getErrorMessage";

export default function SigninForm({ setIsSignIn, prefillValues = undefined }: { setIsSignIn: (value: boolean) => void; prefillValues?: { email?: string } | undefined }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: signInResolver,
    defaultValues: {
      email: prefillValues?.email || "",
    },
  });

  const { signin } = useSignin();

  const onSubmit: SubmitHandler<SignInFormData> = async (data) => {
    try {
      await signin(data);
      showToast("You have successfully signed in.", "success");
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showToast(errorMessage, "error");
    }
  };

  return (
    <AuthFormWrapper
      title="Sign In"
      footer={
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Button variant="link" onClick={() => setIsSignIn(false)}>
            Sign Up
          </Button>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {[
          { name: "email", type: "email", label: "Email" },
          { name: "password", type: "password", label: "Password" },
        ].map((field) => (
          <div key={field.name} className="relative">
            <Controller
              name={field.name as keyof SignInFormData}
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  ref={ref}
                  className="peer w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder=" " // Empty placeholder to activate label movement
                />
              )}
            />
            <label
              htmlFor={field.name}
              className={`absolute left-3 px-1 transition-all text-md text-muted-foreground top-[-20px] peer-placeholder-shown:top-2 peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:text-md peer-focus:top-[-20px] peer-focus:text-md peer-focus:text-primary peer-focus:bg-card`}
            >
              {field.label}
            </label>
            {errors[field.name as keyof FieldErrors<SignInFormData>] && (
              <p className="text-sm text-destructive-foreground mt-1" role="alert">
                {errors[field.name as keyof FieldErrors<SignInFormData>]?.message}
              </p>
            )}
          </div>
        ))}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </AuthFormWrapper>
  );
}
