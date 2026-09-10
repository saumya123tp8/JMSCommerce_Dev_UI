import { useState } from "react";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { extractApiErrorMessage } from "@/lib/apiError";
import { resendOtp } from "@/Service/ProfileServices";
import type { VerificationType } from "@/types/profile";

interface Props {
  type: VerificationType;
  label: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (otp: string) => Promise<void>;
}

const OtpVerifyDialog: React.FC<Props> = ({ type, label, open, onOpenChange, onVerify }) => {
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    if (!otp.trim()) {
      toast.error("Enter the OTP");
      return;
    }
    setSubmitting(true);
    try {
      await onVerify(otp.trim());
      onOpenChange(false);
      setOtp("");
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendOtp(type);
      toast.success("OTP resent");
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    } finally {
      setResending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle>Verify your {label}</DialogTitle></DialogHeader>
        <p className="mb-3 text-sm text-muted-foreground">Enter the OTP we sent to your {label}.</p>
        <Input placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} />
        <div className="mt-4 flex items-center justify-between">
          <button onClick={handleResend} disabled={resending} className="text-xs text-muted-foreground underline">
            {resending ? "Resending..." : "Resend OTP"}
          </button>
          <Button onClick={handleVerify} disabled={submitting}>
            {submitting ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpVerifyDialog;