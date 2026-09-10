import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useProfile } from "@/hooks/useProfile";
import {
  updateMyProfile, requestEmailOtp, requestPhoneOtp, verifyEmailOtp, verifyPhoneOtp,
} from "@/Service/ProfileServices";
import { profileSchema, type ProfileFormValues } from "@/schema/profile";
import { extractApiErrorMessage } from "@/lib/apiError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import OtpVerifyDialog from "./OtpVerifyDialog";
import { CheckCircle2, AlertTriangle } from "lucide-react";

const ProfileTab: React.FC = () => {
  const { profile, setProfile, loading } = useProfile();
  const [submitting, setSubmitting] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", phone: "", age: null, image: "" },
  });

  useEffect(() => {
    if (!profile) return;
    form.reset({ name: profile.name, phone: profile.phone, age: profile.age, image: profile.image ?? "" });
  }, [profile]);

  const onSubmit = async (values: ProfileFormValues) => {
    setSubmitting(true);
    try {
      const updated = await updateMyProfile({
        name: values.name,
        phone: values.phone,
        age: values.age ?? null,
        image: values.image || null,
      });
      setProfile(updated);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const startEmailVerification = async () => {
    try {
      await requestEmailOtp();
      setEmailDialogOpen(true);
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    }
  };

  const startPhoneVerification = async () => {
    try {
      await requestPhoneOtp();
      setPhoneDialogOpen(true);
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    }
  };

  if (loading || !profile) return <p className="text-sm text-muted-foreground">Loading profile...</p>;

  return (
    <div className="max-w-lg space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />

          <FormItem>
            <FormLabel>Email</FormLabel>
            <div className="flex items-center gap-2">
              <Input value={profile.email} disabled />
              {profile.emailVerified ? (
                <Badge className="shrink-0"><CheckCircle2 className="mr-1 h-3 w-3" />Verified</Badge>
              ) : (
                <Button type="button" size="sm" variant="outline" onClick={startEmailVerification}>Verify</Button>
              )}
            </div>
          </FormItem>

          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl><Input {...field} /></FormControl>
                {profile.phoneVerified ? (
                  <Badge className="shrink-0"><CheckCircle2 className="mr-1 h-3 w-3" />Verified</Badge>
                ) : (
                  <Button type="button" size="sm" variant="outline" onClick={startPhoneVerification}>Verify</Button>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="age" render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input type="number" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="image" render={({ field }) => (
            <FormItem><FormLabel>Profile Image URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
          )} />

          <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Changes"}</Button>
        </form>
      </Form>

      {(!profile.emailVerified || !profile.phoneVerified) && (
        <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Verify your {!profile.emailVerified && !profile.phoneVerified ? "email and phone" : !profile.emailVerified ? "email" : "phone"} to secure your account.</span>
        </div>
      )}

      <OtpVerifyDialog type="EMAIL" label="email" open={emailDialogOpen} onOpenChange={setEmailDialogOpen}
        onVerify={async (otp) => {
          const result = await verifyEmailOtp(otp);
          setProfile((prev) => (prev ? { ...prev, emailVerified: result.emailVerified } : prev));
          toast.success("Email verified");
        }}
      />
      <OtpVerifyDialog type="PHONE" label="phone number" open={phoneDialogOpen} onOpenChange={setPhoneDialogOpen}
        onVerify={async (otp) => {
          const result = await verifyPhoneOtp(otp);
          setProfile((prev) => (prev ? { ...prev, phoneVerified: result.phoneVerified } : prev));
          toast.success("Phone verified");
        }}
      />
    </div>
  );
};

export default ProfileTab;