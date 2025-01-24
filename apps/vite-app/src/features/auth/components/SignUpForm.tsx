import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import { useSignup } from "../../user/hooks/use.auth";
import { SignUpFormData } from "@repo/data/types";
import { showToast } from "@repo/ui/components/ui/toaster";
import { AuthFormWrapper } from "./AuthFormWrapper";
import { getErrorMessage } from "../../../../utils/getErrorMessage";

export default function SignupForm({ setIsSignIn }: { setIsSignIn: (value: boolean, prefill?: { email?: string }) => void }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>();

  const { signup, isSubmitting } = useSignup();

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    try {
      await signup(data);
      showToast("You have successfully signed up.", "success");
      setIsSignIn(true, { email: data.email });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showToast(errorMessage, "error");
    }
  };

  const password = watch("password");

  return (
    <AuthFormWrapper
      title="Create Your Account"
      footer={
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button variant="link" onClick={() => setIsSignIn(true)}>
            Sign In
          </Button>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {[
          { name: "email", type: "email", label: "Email", validation: { required: "Email is required" } },
          { name: "username", type: "text", label: "Username", validation: { required: "Username is required" } },
          { name: "password", type: "password", label: "Password", validation: { required: "Password is required" } },
          {
            name: "confirmPassword",
            type: "password",
            label: "Repeat Password",
            validation: {
              required: "Repeat Password is required",
              validate: (value: string) => value === password || "Passwords do not match",
            },
          },
        ].map((field) => (
          <div key={field.name} className="relative">
            <Input
              id={field.name}
              type={field.type}
              {...register(field.name as keyof SignUpFormData, field.validation)}
              className="peer w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder=" " // Placeholder is empty to trigger label movement
            />
            <label
              htmlFor={field.name}
              className={`absolute left-3 px-1 transition-all text-md text-muted-foreground top-[-20px] peer-placeholder-shown:top-2 peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:text-md peer-focus:top-[-20px] peer-focus:text-md peer-focus:text-primary peer-focus:bg-card`}
            >
              {field.label}
            </label>
            {errors[field.name as keyof FieldErrors<SignUpFormData>] && (
              <p className="text-sm text-destructive-foreground mt-1" role="alert">
                {errors[field.name as keyof FieldErrors<SignUpFormData>]?.message}
              </p>
            )}
          </div>
        ))}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>
    </AuthFormWrapper>
  );
}
