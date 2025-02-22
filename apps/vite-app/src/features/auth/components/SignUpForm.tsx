import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { showToast } from '@repo/ui/components/ui/toaster';
import { SignUpFormSchema, signUpResolver } from '@repo/zod';
import { SubmitHandler, useForm } from 'react-hook-form';

import { getErrorMessage } from '../../../../utils/getErrorMessage';
import { useSignup } from '../../user/hooks/use.auth';
import { AuthFormWrapper } from './AuthFormWrapper';

// Define your Zod schema

export default function SignupForm({
  setIsSignIn,
}: {
  setIsSignIn: (value: boolean, prefill?: { email?: string }) => void;
}) {
  const { signup, isSubmitting } = useSignup();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormSchema>({
    resolver: signUpResolver,
  });

  const onSubmit: SubmitHandler<SignUpFormSchema> = async (data) => {
    try {
      await signup(data);
      showToast('You have successfully signed up.', 'success');
      setIsSignIn(true, { email: data.email });
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  return (
    <AuthFormWrapper
      title="Create Your Account"
      footer={
        <p className="text-muted-foreground text-sm">
          Already have an account?{' '}
          <Button variant="link" onClick={() => setIsSignIn(true)}>
            Sign In
          </Button>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="relative">
          <Input
            id="email"
            type="email"
            {...register('email')}
            className="border-border focus:ring-primary focus:border-primary peer w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
            placeholder=" "
          />
          <label
            htmlFor="email"
            className="text-md text-muted-foreground peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:text-md peer-focus:text-md peer-focus:text-primary peer-focus:bg-card absolute left-3 top-[-20px] px-1 transition-all peer-placeholder-shown:top-2 peer-focus:top-[-20px]"
          >
            Email
          </label>
          {errors.email && (
            <p className="text-destructive mt-1 text-sm" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="relative">
          <Input
            id="username"
            type="text"
            {...register('username')}
            className="border-border focus:ring-primary focus:border-primary peer w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
            placeholder=" "
          />
          <label
            htmlFor="username"
            className="text-md text-muted-foreground peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:text-md peer-focus:text-md peer-focus:text-primary peer-focus:bg-card absolute left-3 top-[-20px] px-1 transition-all peer-placeholder-shown:top-2 peer-focus:top-[-20px]"
          >
            Username
          </label>
          {errors.username && (
            <p className="text-destructive mt-1 text-sm" role="alert">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="relative">
          <Input
            id="password"
            type="password"
            {...register('password')}
            className="border-border focus:ring-primary focus:border-primary peer w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
            placeholder=" "
          />
          <label
            htmlFor="password"
            className="text-md text-muted-foreground peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:text-md peer-focus:text-md peer-focus:text-primary peer-focus:bg-card absolute left-3 top-[-20px] px-1 transition-all peer-placeholder-shown:top-2 peer-focus:top-[-20px]"
          >
            Password
          </label>
          {errors.password && (
            <p className="text-destructive mt-1 text-sm" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="relative">
          <Input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className="border-border focus:ring-primary focus:border-primary peer w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
            placeholder=" "
          />
          <label
            htmlFor="confirmPassword"
            className="text-md text-muted-foreground peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:text-md peer-focus:text-md peer-focus:text-primary peer-focus:bg-card absolute left-3 top-[-20px] px-1 transition-all peer-placeholder-shown:top-2 peer-focus:top-[-20px]"
          >
            Repeat Password
          </label>
          {errors.confirmPassword && (
            <p className="text-destructive mt-1 text-sm" role="alert">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>
    </AuthFormWrapper>
  );
}
