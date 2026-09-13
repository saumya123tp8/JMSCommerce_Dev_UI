// src/pages/auth/ForgotPassword.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";

import { forgotPassword } from "@/Service/AuthServices";
import { extractApiErrorMessage } from "@/lib/apiError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const response = await forgotPassword(email.trim());
      toast.success(
        response.message || "If the email exists, a password reset link has been sent"
      );
      setSubmitted(true);
    } catch (error) {
      toast.error(extractApiErrorMessage(error) || "Unable to process password reset request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left brand panel */}
      <div className="hidden md:flex md:w-[42%] flex-col justify-between bg-[#4A3428] p-12 text-white">
        <div>
          <h2 className="text-2xl font-bold">Ambani Coffee</h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/80">
            No worries — it happens. Enter your email and we'll help you back
            into your account.
          </p>
        </div>

        <ul className="space-y-3 text-[15px] text-white/90">
          <li>✓ Secure password reset</li>
          <li>✓ Link expires for your safety</li>
          <li>✓ Back to ordering in minutes</li>
        </ul>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          {submitted ? (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF2FF]">
                  <Mail className="h-7 w-7 text-[#4A3428]" strokeWidth={1.5} />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-[#3F2E22]">Check your email</h1>
              <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
                If an account exists for <span className="font-medium text-[#3F2E22]">{email}</span>,
                you'll receive a password reset link shortly.
              </p>

              <Link to="/login">
                <Button className="mt-8 w-full bg-[#4A3428] hover:bg-[#3A2A1F]">
                  Back to sign in
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[#3F2E22]">Forgot your password?</h1>
              <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
                Enter your email and we'll send you a link to reset it.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-[#3F2E22]">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  {loading ? "Sending..." : "Send reset link"}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;