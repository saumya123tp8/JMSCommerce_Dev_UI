import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  addressSchema,
  type AddressFormData,
} from "../../schema/addressSchema";

import type { Address } from "../../types/address";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

import { Checkbox } from "@/components/ui/checkbox";

interface AddressFormProps {
  address?: Address | null;
  onSubmit: (data: AddressFormData) => Promise<void> | void;
  onCancel: () => void;
  loading?: boolean;
}

const defaultValues: AddressFormData = {
  receiverName: "",
  receiverPhone: "",
  countryCode: "+91",
  houseNumber: "",
  apartment: "",
  street: "",
  landmark: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
  type: "HOME",
  defaultAddress: false,
  deliveryInstructions: "",
};

const AddressForm = ({
  address,
  onSubmit,
  onCancel,
  loading = false,
}: AddressFormProps) => {
  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  useEffect(() => {
    if (address) {
      form.reset({
        receiverName: address.receiverName,
        receiverPhone: address.receiverPhone,
        countryCode: address.countryCode ?? "+91",
        houseNumber: address.houseNumber,
        apartment: address.apartment ?? "",
        street: address.street,
        landmark: address.landmark ?? "",
        city: address.city,
        state: address.state,
        country: address.country,
        pincode: address.pincode,
        type: address.type,
        defaultAddress: address.defaultAddress,
        deliveryInstructions: address.deliveryInstructions ?? "",
      });
    } else {
      form.reset(defaultValues);
    }
  }, [address, form]);

  const handleSubmit = async (data: AddressFormData) => {
    await onSubmit(data);
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          {address ? "Edit Address" : "Add New Address"}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {address
            ? "Update your delivery address."
            : "Add an address for your cafe orders."}
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6"
        >
          {/* Receiver Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="receiverName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receiver Name</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter receiver name"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="receiverPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="9876543210"
                      maxLength={10}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Address Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Type</FormLabel>

                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-6"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="HOME"
                        id="address-home"
                      />
                      <FormLabel htmlFor="address-home">
                        Home
                      </FormLabel>
                    </div>

                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="OFFICE"
                        id="address-office"
                      />
                      <FormLabel htmlFor="address-office">
                        Work
                      </FormLabel>
                    </div>

                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="OTHER"
                        id="address-other"
                      />
                      <FormLabel htmlFor="address-other">
                        Other
                      </FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address */}
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="houseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>House / Flat Number</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="House no. / Flat no."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apartment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apartment / Building</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Apartment or building name"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street / Area</FormLabel>

                <FormControl>
                  <Input
                    placeholder="Enter street or area"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="landmark"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Landmark</FormLabel>

                <FormControl>
                  <Input
                    placeholder="Nearby landmark (optional)"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location */}
          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="City"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="State"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Pincode"
                      maxLength={6}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>

                <FormControl>
                  <Input
                    placeholder="Country"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Delivery Instructions */}
          <FormField
            control={form.control}
            name="deliveryInstructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Instructions</FormLabel>

                <FormControl>
                  <Textarea
                    placeholder="Any special delivery instructions..."
                    className="resize-none"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Default Address */}
          <FormField
            control={form.control}
            name="defaultAddress"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>

                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Set as default address
                  </FormLabel>

                  <p className="text-sm text-muted-foreground">
                    Use this address automatically for future orders.
                  </p>
                </div>
              </FormItem>
            )}
          />

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : address
                  ? "Update Address"
                  : "Save Address"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddressForm;