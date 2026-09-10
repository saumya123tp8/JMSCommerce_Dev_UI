import { z } from "zod";

export const variantSchema = z.object({
  mrp: z.number().positive("MRP must be greater than 0"),
  sellingPrice: z.number().positive("Selling price must be greater than 0"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  sku: z.string().trim().min(0, "Manual SKU : auto generated"),
  barcode: z.string().trim().min(0, "Manual Barcode  : auto generated"),
});

export type VariantFormValues = z.infer<typeof variantSchema>;