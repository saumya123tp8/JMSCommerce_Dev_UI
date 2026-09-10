import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import type { Address } from "@/types/address";
import type { AddressFormData } from "@/schema/addressSchema";

import {
  getAllAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/Service/AddressServices";

import AddressForm from "./AddressForm";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AddressPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] =
    useState<Address | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = async () => {
    try {
      setLoading(true);

      const response = await getAllAddresses();

      setAddresses(response);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleSubmit = async (formData: AddressFormData) => {
    try {
      setLoading(true);

      if (editingAddress) {
        await updateAddress(editingAddress.id, formData);

        toast.success("Address updated successfully");
      } else {
        await createAddress(formData);

        toast.success("Address added successfully");
      }

      setShowForm(false);
      setEditingAddress(null);

      await fetchAddresses();
    } catch (error) {
      console.error("Failed to save address:", error);
      toast.error("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      await deleteAddress(id);

      toast.success("Address deleted successfully");

      await fetchAddresses();
    } catch (error) {
      console.error("Failed to delete address:", error);
      toast.error("Failed to delete address");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      setLoading(true);

      await setDefaultAddress(id);

      toast.success("Default address updated");

      await fetchAddresses();
    } catch (error) {
      console.error("Failed to set default address:", error);
      toast.error("Failed to update default address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            My Addresses
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your delivery addresses.
          </p>
        </div>

        {!showForm && (
          <Button onClick={handleAddAddress}>
            + Add Address
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8">
          <AddressForm
            address={editingAddress}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      )}

      {/* Address List */}
      {!showForm && (
        <>
          {loading && addresses.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              Loading addresses...
            </div>
          ) : addresses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <h2 className="text-lg font-semibold">
                  No addresses found
                </h2>

                <p className="mt-1 mb-4 text-sm text-muted-foreground">
                  Add an address to make checkout faster.
                </p>

                <Button onClick={handleAddAddress}>
                  Add Your First Address
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {addresses.map((address) => (
                <Card key={address.id}>
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {address.receiverName}
                        </h3>

                        <Badge variant="secondary">
                          {address.type}
                        </Badge>
                      </div>

                      {address.defaultAddress && (
                        <Badge>
                          Default
                        </Badge>
                      )}
                    </div>

                    {/* Phone */}
                    <p className="mb-2 text-sm">
                      {address.countryCode &&
                        `${address.countryCode} `}
                      {address.receiverPhone}
                    </p>

                    {/* Address */}
                    <p className="text-sm leading-6 text-muted-foreground">
                      {address.houseNumber},{" "}
                      {address.apartment && (
                        <>
                          {address.apartment},{" "}
                        </>
                      )}
                      {address.street}
                      {address.landmark && (
                        <>
                          , {address.landmark}
                        </>
                      )}
                      <br />
                      {address.city}, {address.state}{" "}
                      - {address.pincode}
                      <br />
                      {address.country}
                    </p>

                    {/* Instructions */}
                    {address.deliveryInstructions && (
                      <p className="mt-3 rounded-md bg-muted p-3 text-sm">
                        <span className="font-medium">
                          Delivery:
                        </span>{" "}
                        {address.deliveryInstructions}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleEditAddress(address)
                        }
                        disabled={loading}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          handleDelete(address.id)
                        }
                        disabled={loading}
                      >
                        Delete
                      </Button>

                      {!address.defaultAddress && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleSetDefault(address.id)
                          }
                          disabled={loading}
                        >
                          Set Default
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AddressPage;