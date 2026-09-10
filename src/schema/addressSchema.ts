import { z } from "zod";

export const addressSchema = z.object({
  receiverName: z
    .string()
    .min(2, "Receiver name must be at least 2 characters"),

  receiverPhone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),

  countryCode: z.string().optional().nullable(),

  houseNumber: z
    .string()
    .min(1, "House number is required"),

  apartment: z.string().optional().nullable(),

  street: z
    .string()
    .min(2, "Street is required"),

  landmark: z.string().optional().nullable(),

  city: z
    .string()
    .min(2, "City is required"),

  state: z
    .string()
    .min(2, "State is required"),

  country: z
    .string()
    .min(2, "Country is required"),

  pincode: z
    .string()
    .regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),

  type: z.enum(["HOME", "OFFICE", "OTHER"]),

  defaultAddress: z.boolean(),

  deliveryInstructions: z.string().optional().nullable(),
});

export type AddressFormData = z.infer<typeof addressSchema>;