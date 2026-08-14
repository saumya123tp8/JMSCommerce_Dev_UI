import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  currency: z.enum(["INR", "USD", "EUR"]),
  primaryImage: z.string().trim().url("Must be a valid URL"),
  shortDescription: z.string().trim().min(1, "Short description is required").max(200),
  description: z.string().trim().min(1, "Description is required"),
  categoryId: z.number({ required_error: "Please select a category" }).int().positive(),
  brandId: z.number({ required_error: "Please select a brand" }).int().positive(),
  inventoryType: z.enum(["FINITE", "INFINITE"]),
});

export type ProductFormValues = z.infer<typeof productSchema>;