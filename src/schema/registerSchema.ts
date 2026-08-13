import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name is too long"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email"),

   phone: z
      .string()
      .trim()
      .regex(
        /^[6-9]\d{9}$/,
        "Please enter a valid 10-digit mobile number"
      ),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[a-z]/, "Must contain one lowercase letter")
    .regex(/[0-9]/, "Must contain one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Must contain one special character"
    ),

  confirmPassword: z
    .string()
  
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;