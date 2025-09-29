import { useState } from 'react';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { showToast } from '@repo/ui/components/ui/toaster';
import { SignUpFormSchema, signUpResolver } from '@repo/zod';
import { ArrowRight, CheckCircle, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { getErrorMessage } from '../../../../utils/getErrorMessage';
import { useSignup } from '../../user/hooks/use.auth';

export default function SignupForm({
  setIsSignIn,
}: {
  setIsSignIn: (value: boolean, prefill?: { email?: string }) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, isSubmitting } = useSignup();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormSchema>({
    resolver: signUpResolver,
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const onSubmit: SubmitHandler<SignUpFormSchema> = async (data) => {
    try {
      await signup(data);
      showToast('You have successfully signed up.', 'success');
      setIsSignIn(true, { email: data.email });
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
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
      name: 'username',
      type: 'text',
      label: 'Username',
      icon: User,
      placeholder: 'Choose a username',
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      icon: Lock,
      placeholder: 'Create a strong password',
    },
    {
      name: 'confirmPassword',
      type: 'password',
      label: 'Confirm Password',
      icon: Lock,
      placeholder: 'Repeat your password',
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Create Account</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Join our community of professionals
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
        {formFields.map((field) => {
          const IconComponent = field.icon;
          const isPassword = field.type === 'password';
          const isConfirmPassword = field.name === 'confirmPassword';
          const showPasswordToggle = isPassword || isConfirmPassword;
          const shouldShowPassword = isPassword ? showPassword : showConfirmPassword;
          const hasMatch =
            isConfirmPassword && password && confirmPassword && password === confirmPassword;

          return (
            <div key={field.name} className="space-y-2">
              <label htmlFor={field.name} className="text-sm font-medium text-foreground block">
                {field.label}
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </div>

                <Input
                  id={field.name}
                  type={
                    showPasswordToggle ? (shouldShowPassword ? 'text' : 'password') : field.type
                  }
                  {...register(field.name as keyof SignUpFormSchema)}
                  placeholder={field.placeholder}
                  className={`
                    pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base
                    border-border bg-background
                    focus:border-primary focus:ring-2 focus:ring-primary/20
                    transition-all duration-200
                    ${errors[field.name as keyof SignUpFormSchema] ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}
                    ${hasMatch ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20' : ''}
                  `}
                />

                <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 space-x-1">
                  {hasMatch && <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />}

                  {showPasswordToggle && (
                    <button
                      type="button"
                      onClick={() => {
                        if (isPassword) {
                          setShowPassword(!showPassword);
                        } else {
                          setShowConfirmPassword(!showConfirmPassword);
                        }
                      }}
                      className="hover:text-foreground transition-colors"
                    >
                      {shouldShowPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {errors[field.name as keyof SignUpFormSchema] && (
                <p
                  className="text-destructive text-xs sm:text-sm flex items-center gap-1"
                  role="alert"
                >
                  <span className="w-1 h-1 rounded-full bg-destructive" />
                  {errors[field.name as keyof SignUpFormSchema]?.message}
                </p>
              )}
            </div>
          );
        })}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 sm:py-3 text-sm sm:text-base font-semibold bg-primary hover:bg-primary/90 transition-all duration-200 group mt-6 sm:mt-8"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
              Creating Account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-6 sm:mt-8 text-center">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            onClick={() => setIsSignIn(true)}
            className="text-primary hover:text-primary/80 font-medium hover:underline transition-all"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
