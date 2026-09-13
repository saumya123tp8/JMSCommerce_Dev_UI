// src/pages/auth/ResetPassword.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock, CheckCircle2, XCircle } from "lucide-react";

import { resetPassword } from "@/Service/AuthServices";
import { extractApiErrorMessage } from "@/lib/apiError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BrandPanel = ({ message }: { message: string }) => (
  <div className="hidden md:flex md:w-[42%] flex-col justify-between bg-[#4A3428] p-12 text-white">
    <div>
      <h2 className="text-2xl font-bold">Ambani Coffee</h2>
      <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/80">{message}</p>
    </div>
    <ul className="space-y-3 text-[15px] text-white/90">
      <li>✓ Secure password reset</li>
      <li>✓ Link expires for your safety</li>
      <li>✓ Back to ordering in minutes</li>
    </ul>
  </div>
);

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }
    if (!password) {
      toast.error("Please enter a new password");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await resetPassword(token, password);
      toast.success(response.message || "Password reset successfully");
      setSuccess(true);
    } catch (error) {
      toast.error(extractApiErrorMessage(error) || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen bg-white">
        <BrandPanel message="Let's get your account back on track." />
        <div className="flex flex-1 items-center justify-center px-6 py-16">
          <div className="w-full max-w-sm text-center">
            <div className="mb-6 flex justify-center">
              <XCircle className="h-14 w-14 text-[#B45309]" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold text-[#3F2E22]">Invalid reset link</h1>
            <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
              This password reset link is missing a valid token.
            </p>
            <Link to="/forgot-password">
              <Button className="mt-8 w-full bg-[#4A3428] hover:bg-[#3A2A1F]">
                Request new reset link
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen bg-white">
        <BrandPanel message="You're all set. Sign in with your new password whenever you're ready." />
        <div className="flex flex-1 items-center justify-center px-6 py-16">
          <div className="w-full max-w-sm text-center">
            <div className="mb-6 flex justify-center">
              <CheckCircle2 className="h-14 w-14 text-[#0D9488]" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold text-[#3F2E22]">Password reset</h1>
            <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
              Your password has been changed successfully.
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="mt-8 w-full bg-[#4A3428] hover:bg-[#3A2A1F]"
            >
              Go to sign in
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <BrandPanel message="One last step — choose a new password to secure your account." />

      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF2FF]">
              <Lock className="h-7 w-7 text-[#4A3428]" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-center text-2xl font-bold text-[#3F2E22]">Reset your password</h1>
          <p className="mt-2 text-center text-[15px] leading-relaxed text-gray-500">
            Enter your new password below.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-[#3F2E22]">
                New password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="bg-[#EEF2FF]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-[#3F2E22]">
                Confirm password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
                className="bg-[#EEF2FF]"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4A3428] hover:bg-[#3A2A1F]"
            >
              {loading ? "Resetting..." : "Reset password"}
            </Button>

            <p className="text-center">
              <Link
                to="/login"
                className="text-sm text-gray-500 underline underline-offset-4 hover:text-[#3F2E22]"
              >
                Back to sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;