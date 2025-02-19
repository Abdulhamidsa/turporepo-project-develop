import { SignUpFormData } from '@repo/data/types';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { showToast } from '@repo/ui/components/ui/toaster';
import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form';

import { getErrorMessage } from '../../../../utils/getErrorMessage';
import { useSignup } from '../../user/hooks/use.auth';
import { AuthFormWrapper } from './AuthFormWrapper';

export default function SignupForm({
  setIsSignIn,
}: {
  setIsSignIn: (value: boolean, prefill?: { email?: string }) => void;
}) {
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
      showToast('You have successfully signed up.', 'success');
      setIsSignIn(true, { email: data.email });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showToast(errorMessage, 'error');
    }
  };

  const password = watch('password');

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
        {[
          {
            name: 'email',
            type: 'email',
            label: 'Email',
            validation: { required: 'Email is required' },
          },
          {
            name: 'username',
            type: 'text',
            label: 'Username',
            validation: { required: 'Username is required' },
          },
          {
            name: 'password',
            type: 'password',
            label: 'Password',
            validation: { required: 'Password is required' },
          },
          {
            name: 'confirmPassword',
            type: 'password',
            label: 'Repeat Password',
            validation: {
              required: 'Repeat Password is required',
              validate: (value: string) => value === password || 'Passwords do not match',
            },
          },
        ].map((field) => (
          <div key={field.name} className="relative">
            <Input
              id={field.name}
              type={field.type}
              {...register(field.name as keyof SignUpFormData, field.validation)}
              className="border-border focus:ring-primary focus:border-primary peer w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
              placeholder=" " // Placeholder is empty to trigger label movement
            />
            <label
              htmlFor={field.name}
              className={`text-md text-muted-foreground peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:text-md peer-focus:text-md peer-focus:text-primary peer-focus:bg-card absolute left-3 top-[-20px] px-1 transition-all peer-placeholder-shown:top-2 peer-focus:top-[-20px]`}
            >
              {field.label}
            </label>
            {errors[field.name as keyof FieldErrors<SignUpFormData>] && (
              <p className="text-destructive-foreground mt-1 text-sm" role="alert">
                {errors[field.name as keyof FieldErrors<SignUpFormData>]?.message}
              </p>
            )}
          </div>
        ))}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>
    </AuthFormWrapper>
  );
}
