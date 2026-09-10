import { z } from "zod";

const categoryTextPattern = /^[a-zA-Z0-9&(),\-' ]+$/;
const parentIdField = z.preprocess((val) => {
  if (val === "" || val === "0" || val === null || val === undefined) {
    return null;
  }
  if (typeof val === "string") {
    const parsed = Number(val);
    return Number.isNaN(parsed) ? val : parsed; // let Zod reject genuinely invalid strings
  }
  return val;
}, z.number().nullable().optional());
export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(30, "Name must be at most 30 characters")
    .regex(
      categoryTextPattern,
      "Name can only contain letters, numbers, & ( ) - , ' and spaces",
    ),
  description: z
    .string()
    .trim()
    .max(300, "Description must be at most 300 characters")
    .refine(
      (value) => value === "" || categoryTextPattern.test(value),
      "Description contains invalid characters",
    )
    .optional(),
    parentId: parentIdField,
});

export const updateCategorySchema = createCategorySchema.extend({
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;

export function parseParentId(parentId?: string | null): number | null {
  if (!parentId) return null;
  const parsed = Number(parentId);
  return Number.isNaN(parsed) ? null : parsed;
}
