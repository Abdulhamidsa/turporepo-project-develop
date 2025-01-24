import { z } from "zod";

// Signin schema
export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters long."),
});

// Signup schema
export const signUpSchema = z
  .object({
    email: z.string().email("Please enter a valid email address."),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters long.")
      .regex(/^(?=.*[A-Z])|(?=.*\d)/, "Password must contain at least one uppercase letter or a number."),
    confirmPassword: z.string().min(1, "Password confirmation is required").min(6, "Password confirmation must be at least 6 characters long."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const updateCredentialsSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  password: z.string().min(8, "Password must be at least 8 characters long").optional(),
});

export type UpdateCredentialsPayload = z.infer<typeof updateCredentialsSchema>;
