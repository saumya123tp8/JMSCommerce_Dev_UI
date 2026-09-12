// src/pages/WelcomeCheckEmail.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";

const WelcomeCheckEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as { email?: string })?.email;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden md:flex md:w-[42%] bg-[#4A3428] text-white flex-col justify-between p-12">
        <div>
          <h2 className="text-2xl font-bold">Ambani Coffee</h2>
          <p className="mt-4 text-white/80 text-[15px] leading-relaxed max-w-sm">
            Thanks for joining us. Freshly brewed happiness is just one
            confirmation away.
          </p>
        </div>

        <ul className="space-y-3 text-[15px] text-white/90">
          <li>✓ Freshly Brewed Happiness</li>
          <li>✓ Secure Authentication</li>
          <li>✓ Fast Checkout Experience</li>
        </ul>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#EEF2FF] flex items-center justify-center">
              <Mail className="w-7 h-7 text-[#4A3428]" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-[#3F2E22]">
            Welcome — you're almost in
          </h1>

          <p className="text-[15px] text-gray-500 mt-2 leading-relaxed">
            {email ? (
              <>We sent a verification link to <span className="text-[#3F2E22] font-medium">{email}</span>.</>
            ) : (
              "We sent you a verification link."
            )}{" "}
            You can verify anytime — taking you to sign in now.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCheckEmail;