// src/pages/VerifyEmail.tsx
import { useEffect, useRef,useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Mail, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { verifyEmail, resendVerificationEmail } from "@/Service/AuthServices";

type Status = "loading" | "success" | "error";
 
const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  const email = searchParams.get("email");
  const verificationStarted = useRef(false);

  useEffect(() => {

    if (verificationStarted.current) {
        return;
      }
  
      verificationStarted.current = true;

    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("This link is missing a verification token.");
      return;
    }

    const verify = async () => {
      try {
        const response = await verifyEmail(token);
        setStatus(response.success ? "success" : "error");
        setMessage(response.message);
        if (response.success) setTimeout(() => navigate("/login"), 3000);
      } catch {
        setStatus("error");
        setMessage("We couldn't verify your email.");
      }
    };

    verify();
  }, [searchParams, navigate]);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setResendMsg("");
    try {
      const res = await resendVerificationEmail(email);
      setResendMsg(res.message || "A new link is on its way.");
    } catch {
      setResendMsg("That didn't go through. Try again in a moment.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left brand panel — matches Login */}
      <div className="hidden md:flex md:w-[42%] bg-[#4A3428] text-white flex-col justify-between p-12">
        <div>
          <h2 className="text-2xl font-bold">Ambani Coffee</h2>
          <p className="mt-4 text-white/80 text-[15px] leading-relaxed max-w-sm">
            One last step before your first order — confirm it's really you,
            and your account is ready to go.
          </p>
        </div>

        <ul className="space-y-3 text-[15px] text-white/90">
          <li>✓ Save your favorite blends</li>
          <li>✓ Track every order in real time</li>
          <li>✓ Earn rewards on every cup</li>
        </ul>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm text-center">
          <div className="flex justify-center mb-6">
            {status === "loading" && (
              <Loader2 className="w-14 h-14 text-[#4A3428] animate-spin" strokeWidth={1.5} />
            )}
            {status === "success" && (
              <CheckCircle2 className="w-14 h-14 text-[#0D9488]" strokeWidth={1.5} />
            )}
            {status === "error" && (
              <XCircle className="w-14 h-14 text-[#B45309]" strokeWidth={1.5} />
            )}
          </div>

          <h1 className="text-2xl font-bold text-[#3F2E22]">
            {status === "loading"
              ? "Confirming your email"
              : status === "success"
              ? "You're verified"
              : "That link didn't work"}
          </h1>

          <p className="text-[15px] text-gray-500 mt-2 leading-relaxed">
            {status === "loading" ? "One moment, this only takes a second." : message}
          </p>

          {status === "success" && (
            <p className="text-sm text-[#0D9488] mt-4">Taking you to sign in…</p>
          )}

          {status === "error" && (
            <div className="mt-8 space-y-4">
              <p className="text-sm text-gray-500">
                Links expire after a while, or may have already been used.
              </p>

              {email ? (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="w-full rounded-lg bg-[#4A3428] text-white text-sm font-medium py-3 hover:bg-[#3A2A1F] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {resending ? "Sending a new link…" : "Resend verification email"}
                </button>
              ) : (
                <button
                  onClick={() => navigate("/register")}
                  className="w-full rounded-lg border border-gray-300 text-[#3F2E22] text-sm font-medium py-3 hover:bg-gray-50 transition-colors"
                >
                  Back to registration
                </button>
              )}

              {resendMsg && <p className="text-sm text-[#0D9488]">{resendMsg}</p>}

              <p>
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm text-gray-500 underline underline-offset-4 hover:text-[#3F2E22]"
                >
                  Go to sign in instead
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;