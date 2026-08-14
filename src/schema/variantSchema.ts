import { z } from "zod";

export const variantSchema = z.object({
  mrp: z.number().positive("MRP must be greater than 0"),
  sellingPrice: z.number().positive("Selling price must be greater than 0"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  sku: z.string().trim().min(1, "SKU is required"),
  barcode: z.string().trim().min(1, "Barcode is required"),
});

export type VariantFormValues = z.infer<typeof variantSchema>;