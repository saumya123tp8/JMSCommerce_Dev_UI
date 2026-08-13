import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(3, "Name should contain at least 3 characters"),

  email: z
    .email("Please enter a valid email address"),

  subject: z
    .string()
    .min(5, "Subject should contain at least 5 characters"),

  message: z
    .string()
    .min(15, "Message should contain at least 15 characters"),
});

export type ContactSchema = z.infer<typeof contactSchema>;