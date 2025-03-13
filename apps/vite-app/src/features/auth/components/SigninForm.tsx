import { SignInFormData } from '@repo/data/types';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { showToast } from '@repo/ui/components/ui/toaster';
import { signInResolver } from '@repo/zod/resolver';
import { Controller, FieldErrors, SubmitHandler, useForm } from 'react-hook-form';

import { getErrorMessage } from '../../../../utils/getErrorMessage';
import { useSignin } from '../../user/hooks/use.auth';
import { AuthFormWrapper } from './AuthFormWrapper';

export default function SigninForm({
  setIsSignIn,
  prefillValues = undefined,
}: {
  setIsSignIn: (value: boolean) => void;
  prefillValues?: { email?: string } | undefined;
}) {
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
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showToast(errorMessage, 'error');
    }
  };

  return (
    <AuthFormWrapper
      title="Sign In"
      footer={
        <p className="text-muted-foreground text-sm">
          Don't have an account?{' '}
          <Button variant="link" onClick={() => setIsSignIn(false)}>
            Sign Up
          </Button>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {[
          { name: 'email', type: 'email', label: 'Email' },
          { name: 'password', type: 'password', label: 'Password' },
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
                  className="border-border focus:ring-primary focus:border-primary peer w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
                  placeholder=" " // Empty placeholder to activate label movement
                />
              )}
            />
            <label
              htmlFor={field.name}
              className={`text-md text-muted-foreground peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:text-md peer-focus:text-md peer-focus:text-primary peer-focus:bg-card absolute left-3 top-[-20px] px-1 transition-all peer-placeholder-shown:top-2 peer-focus:top-[-20px]`}
            >
              {field.label}
            </label>
            {errors[field.name as keyof FieldErrors<SignInFormData>] && (
              <p className="text-destructive-foreground mt-1 text-sm" role="alert">
                {errors[field.name as keyof FieldErrors<SignInFormData>]?.message}
              </p>
            )}
          </div>
        ))}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </AuthFormWrapper>
  );
}
