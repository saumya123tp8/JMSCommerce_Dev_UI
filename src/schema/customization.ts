import { z } from "zod";

export const customizationOptionSchema = z.object({
  name: z.string().trim().min(1, "Option name is required"),
  adjustmentType: z.enum(["FIXED", "PERCENTAGE"]),
  adjustmentValue: z.number().min(0, "Must be 0 or greater"),
  displayOrder: z.number().int().min(0),
});

export const customizationGroupSchema = z
  .object({
    name: z.string().trim().min(1, "Group name is required"),
    selectionType: z.enum(["SINGLE", "MULTIPLE"]),
    required: z.boolean(),
    minSelection: z.number().int().min(0),
    maxSelection: z.number().int().min(1, "Must be greater than 0"),
    displayOrder: z.number().int().min(0),
    options: z.array(customizationOptionSchema).min(1, "Add at least one option"),
  })
  .refine((g) => g.minSelection <= g.maxSelection, {
    message: "Minimum selection cannot exceed maximum selection",
    path: ["minSelection"],
  });

export const customizationFormSchema = z.object({
  groups: z.array(customizationGroupSchema).min(1, "Add at least one group"),
});

export type CustomizationFormValues = z.infer<typeof customizationFormSchema>;