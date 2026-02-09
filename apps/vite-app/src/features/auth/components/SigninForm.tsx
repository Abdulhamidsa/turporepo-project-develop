import { useState } from 'react';

import { SignInFormData } from '@repo/data/types';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { showToast } from '@repo/ui/components/ui/toaster';
import { signInResolver } from '@repo/zod/resolver';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Controller, FieldErrors, SubmitHandler, useForm } from 'react-hook-form';

import { getErrorMessage } from '../../../../utils/getErrorMessage';
import { useSignin } from '../../user/hooks/use.auth';

export default function SigninForm({
  setIsSignIn,
  prefillValues = undefined,
}: {
  setIsSignIn: (value: boolean) => void;
  prefillValues?: { email?: string } | undefined;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: signInResolver,
    defaultValues: {
      email: prefillValues?.email ?? '',
    },
  });

  const { signin } = useSignin();

  const onSubmit: SubmitHandler<SignInFormData> = async (data) => {
    try {
      await signin(data);
      showToast('You have successfully signed in.', 'success');

      // Add debug message to show where we're redirecting
      // console.log('Authentication successful, redirecting from SigninForm');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showToast(errorMessage, 'error');
    }
  };

  const formFields = [
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      icon: Mail,
      placeholder: 'Enter your email',
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      icon: Lock,
      placeholder: 'Enter your password',
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6" noValidate>
        {formFields.map((field) => {
          const IconComponent = field.icon;
          const isPassword = field.type === 'password';

          return (
            <div key={field.name} className="space-y-2">
              <label htmlFor={field.name} className="text-sm font-medium text-foreground block">
                {field.label}
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </div>

                <Controller
                  name={field.name as keyof SignInFormData}
                  control={control}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Input
                      id={field.name}
                      name={field.name}
                      type={isPassword ? (showPassword ? 'text' : 'password') : field.type}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      ref={ref}
                      placeholder={field.placeholder}
                      className={`
                        pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base
                        border-border bg-background
                        focus:border-primary focus:ring-2 focus:ring-primary/20
                        transition-all duration-200
                        ${errors[field.name as keyof FieldErrors<SignInFormData>] ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}
                      `}
                    />
                  )}
                />

                {isPassword && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    )}
                  </button>
                )}
              </div>

              {errors[field.name as keyof FieldErrors<SignInFormData>] && (
                <p
                  className="text-destructive text-xs sm:text-sm flex items-center gap-1"
                  role="alert"
                >
                  <span className="w-1 h-1 rounded-full bg-destructive" />
                  {errors[field.name as keyof FieldErrors<SignInFormData>]?.message}
                </p>
              )}
            </div>
          );
        })}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 sm:py-3 text-sm sm:text-base font-semibold bg-primary hover:bg-primary/90 transition-all duration-200 group"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-6 sm:mt-8 text-center">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Don't have an account?{' '}
          <button
            onClick={() => setIsSignIn(false)}
            className="text-primary hover:text-primary/80 font-medium hover:underline transition-all"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
}
