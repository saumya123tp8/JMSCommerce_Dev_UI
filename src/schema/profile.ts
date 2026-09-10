import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  age: z.number().int().min(0).max(120).nullable().optional(),
  image: z.string().trim().url("Must be a valid URL").optional().or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;