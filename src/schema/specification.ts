import { z } from "zod";

export const specificationDataTypes = [
  "STRING",
  "NUMBER",
  "BOOLEAN",
  "ENUM",
  "DATE",
] as const;

export const specificationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(50, "Name must be 50 characters or fewer"),
  displayName: z
    .string()
    .trim()
    .min(1, "Display name is required")
    .max(50, "Display name must be 50 characters or fewer"),
  description: z.string().trim().max(300).optional().or(z.literal("")),
  dataType: z.enum(specificationDataTypes),
  unit: z.string().trim().max(20).optional().or(z.literal("")),
  required: z.boolean(),
  filterable: z.boolean(),
  searchable: z.boolean(),
  displayOrder: z.number().int().min(0),
  placeholder: z.string().trim().max(100).optional().or(z.literal("")),
  defaultValue: z.string().trim().max(100).optional().or(z.literal("")),
  categoryId: z.number().int().positive().refine((val) => val > 0, { message: "Please select a category" }),
});

export type SpecificationFormValues = z.infer<typeof specificationSchema>;