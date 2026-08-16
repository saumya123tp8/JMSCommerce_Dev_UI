import { z } from "zod";

export const addressSchema = z.object({
  receiverName: z.string().trim().min(1, "Name is required"),
  receiverPhone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  countryCode: z.string().trim().optional(),
  houseNumber: z.string().trim().min(1, "House/building number is required"),
  apartment: z.string().trim().optional(),
  street: z.string().trim().min(1, "Street is required"),
  landmark: z.string().trim().optional(),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  country: z.string().trim().optional(),
  pincode: z.string().trim().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  type: z.enum(["HOME", "WORK", "OTHER"]).optional(), // enum unconfirmed per doc TODO
  defaultAddress: z.boolean().optional(),
  deliveryInstructions: z.string().trim().optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;