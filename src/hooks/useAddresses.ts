import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getAllAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/Service/AddressServices";
import { extractApiErrorMessage } from "@/lib/apiError";
import type { Address, AddressPayload } from "@/types/address";

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Server already orders default-first per the API doc —
      // no client-side sort needed.
      setAddresses(await getAllAddresses());
    } catch (err) {
      setError(extractApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const add = async (payload: AddressPayload) => {
    try {
      await createAddress(payload);
      toast.success("Address added");
      await fetchAddresses();
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    }
  };

  const edit = async (id: number, payload: AddressPayload) => {
    try {
      await updateAddress(id, payload);
      toast.success("Address updated");
      await fetchAddresses();
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    }
  };

  const remove = async (id: number) => {
    try {
      await deleteAddress(id);
      toast.success("Address deleted");
      await fetchAddresses();
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    }
  };

  const makeDefault = async (id: number) => {
    try {
      await setDefaultAddress(id);
      toast.success("Default address updated");
      await fetchAddresses();
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    }
  };

  return { addresses, loading, error, add, edit, remove, makeDefault, refetch: fetchAddresses };
}