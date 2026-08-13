import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";

import Layout from "../../components/layout/Layout";
import OAuthButtons from "./OAuthButtons";

import { loginSchema, type LoginFormData } from '../../schema/loginSchema';
import { loginThunk } from "../../redux/thunks/authThunks/loginThunk";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const Login: React.FC = () => {

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const location = useLocation();

    const [showPassword, setShowPassword] = useState(false);

    const { loading } = useAppSelector(
        state => state?.auth
    );
    console.log("Loading state from Redux:", loading);
const {

    register,

    handleSubmit,

    formState: { errors }

} = useForm<LoginFormData>({

    resolver: zodResolver(loginSchema),

    mode: "onTouched"

});
const onSubmit = async (
    data: LoginFormData
) => {

    try {

        await dispatch(
            loginThunk(data)
        ).unwrap();
        console.log('Login successful'+data);
        toast.success("Welcome Back!");
        
        navigate(
            (location.state as string) || "/"
        );
        

    } catch (error: any) {

        toast.error(
            error.error||"Login Failed"
        );

    }

};
return (
  <Layout title="Login">
    <div className="min-h-[calc(100vh-64px)] bg-[#F7F3EE] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl grid md:grid-cols-2">

        {/* Left Side */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-[#4B2E1F] to-[#6F4E37] p-12 text-white">

          <div>
            <h1 className="text-4xl font-bold tracking-wide">
              AMBANI COFFEE
            </h1>

            <p className="mt-6 text-2xl font-semibold">
              Welcome Back ☕
            </p>

            <p className="mt-4 leading-7 text-amber-100">
              Sign in to continue exploring our handcrafted coffees,
              premium beverages and exclusive offers.
            </p>
          </div>

          <div className="space-y-3 text-sm text-amber-100">
            <p>✔ Freshly Brewed Happiness</p>
            <p>✔ Secure Authentication</p>
            <p>✔ Fast Checkout Experience</p>
          </div>

        </div>

        {/* Right Side */}
        <div className="p-8 sm:p-12">

          <div className="mb-8">

            <h2 className="text-3xl font-bold text-slate-800">
              Login
            </h2>

            <p className="mt-2 text-slate-500">
              Enter your credentials to continue.
            </p>

          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >

            {/* Email */}

            <div>

              <label
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  {...register("email")}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    py-3
                    pl-12
                    pr-4
                    outline-none
                    transition-all
                    focus:border-[#5A3825]
                    focus:ring-4
                    focus:ring-[#5A3825]/10
                  "
                />

              </div>

              {errors.email && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}

            </div>

            {/* Password */}

            <div>

              <label
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register("password")}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    py-3
                    pl-12
                    pr-12
                    outline-none
                    transition-all
                    focus:border-[#5A3825]
                    focus:ring-4
                    focus:ring-[#5A3825]/10
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#5A3825]"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

              {errors.password && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}

            </div>
            
            {/* Forgot Password */}

            <div className="flex justify-end">

              <Link
                to="/forgot-password"
                className="
                  text-sm
                  font-medium
                  text-[#5A3825]
                  hover:underline
                "
              >
                Forgot Password?
              </Link>

            </div>

            {/* Login Button */}

            <button
              disabled={loading}
              className="
                flex
                w-full
                items-center
                justify-center
                rounded-xl
                bg-[#5A3825]
                py-3
                font-semibold
                text-white
                transition-all
                hover:bg-[#45291B]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                <>
                  <Loader2
                    size={20}
                    className="mr-2 animate-spin"
                  />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>

          </form>

          {/* Divider */}

          <div className="my-8 flex items-center">

            <div className="h-px flex-1 bg-slate-200" />

            <span className="mx-4 text-sm text-slate-500">
              OR
            </span>

            <div className="h-px flex-1 bg-slate-200" />

          </div>

          <OAuthButtons />

          <p className="mt-8 text-center text-sm text-slate-600">

            Don't have an account?

            <Link
              to="/register"
              className="ml-2 font-semibold text-[#5A3825] hover:underline"
            >
              Register
            </Link>

          </p>

        </div>

      </div>
    </div>
  </Layout>
);
}


export default Login;