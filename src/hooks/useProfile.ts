import { useCallback, useEffect, useState } from "react";
import { getMyProfile } from "@/Service/ProfileServices";
import type { UserProfile } from "@/types/profile";

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setProfile(await getMyProfile());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { profile, setProfile, loading, error, refetch: fetch };
}