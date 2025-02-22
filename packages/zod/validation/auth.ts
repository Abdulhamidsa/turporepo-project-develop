import { z } from 'zod';

// Signin schema
export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long.'),
});

export const signUpSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    username: z.string().min(1, { message: 'Username is required' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Infer the type for form data from the schema
export type SignUpFormSchema = z.infer<typeof signUpSchema>;

// Signup schema
// export const signUpSchema = z
//   .object({
//     email: z.string().email('Please enter a valid email address.'),
//     password: z
//       .string()
//       .min(1, 'Password is required')
//       .min(6, 'Password must be at least 6 characters long.')
//       .regex(
//         /^(?=.*[A-Z])|(?=.*\d)/,
//         'Password must contain at least one uppercase letter or a number.',
//       ),
//     confirmPassword: z
//       .string()
//       .min(1, 'Password confirmation is required')
//       .min(6, 'Password confirmation must be at least 6 characters long.'),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: 'Passwords do not match.',
//     path: ['confirmPassword'],
//   });

export const updateCredentialsSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters long').optional(),
});
// export type SignUpPayload = z.infer<typeof signUpSchema>;

export type UpdateCredentialsPayload = z.infer<typeof updateCredentialsSchema>;
