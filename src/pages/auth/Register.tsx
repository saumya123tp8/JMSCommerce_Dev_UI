import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { User, Mail, Lock, Eye, EyeOff, Loader2, Phone } from "lucide-react";

import toast from "react-hot-toast";

import Layout from "../../components/layout/Layout";
import OAuthButtons from "./OAuthButtons";

import {
  registerSchema,
  type RegisterFormData,
} from "../../schema/registerSchema";

import { registerThunk } from "../../redux/thunks/authThunks/registerThunk";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const Register: React.FC = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const { loading } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
 
      //validation shift to schema
      //  if(data.password!==data.confirmPassword){

      //   setError("confirmPassword",{

      //       type:"manual",

      //       message:"Passwords do not match"

      //   });

        // return;
    //  }

      await dispatch(registerThunk(data)).unwrap();

      toast.success("Registration Successful 🎉");

      navigate("/login");
    } catch (error: any) {
      toast.error(error || "Registration Failed");
    }
  };

  return (
    <Layout title="Register">
      <div className="min-h-[calc(100vh-64px)] bg-[#F7F3EE] flex items-center justify-center px-4 py-12">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-[#4B2E1F] to-[#6F4E37] p-12 text-white md:flex md:flex-col md:justify-between">
            <div>
              <h1 className="text-4xl font-bold">AMBANI COFFEE</h1>

              <p className="mt-6 text-2xl font-semibold">
                Join Our Coffee Family ☕
              </p>

              <p className="mt-4 leading-7 text-amber-100">
                Create your account to explore handcrafted beverages, exclusive
                offers and seamless ordering.
              </p>
            </div>

            <div className="space-y-3 text-sm text-amber-100">
              <p>✔ Personalized Experience</p>

              <p>✔ Faster Checkout</p>

              <p>✔ Reward Points & Offers</p>
            </div>
          </div>
          <div className="p-8 sm:p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800">
                Create Account
              </h2>

              <p className="mt-2 text-slate-500">
                Fill in the details below to get started.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="John Doe"
                    autoComplete="name"
                    {...register("name")}
                    className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none transition-all focus:border-[#5A3825] focus:ring-4 focus:ring-[#5A3825]/10"
                  />
                </div>

                {errors.name && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none transition-all focus:border-[#5A3825] focus:ring-4 focus:ring-[#5A3825]/10"
                  />
                </div>

                {errors.email && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...register("phone")}
                    className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none transition-all focus:border-[#5A3825] focus:ring-4 focus:ring-[#5A3825]/10"
                  />
                </div>

                {errors.phone && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a strong password"
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
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#5A3825]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

             
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="confirm used password"
                    {...register("confirmPassword")}
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
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#5A3825]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
                

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-slate-600">
                <p className="font-semibold text-[#5A3825]">
                  Password Requirements
                </p>

                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Minimum 8 characters</li>
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One number</li>
                  <li>One special character</li>
                </ul>
              </div>
              <button
                type="submit"
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
                  duration-300
                  hover:bg-[#472C1D]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
            <div className="my-8 flex items-center">
              <div className="h-px flex-1 bg-slate-200" />

              <span className="mx-4 text-sm text-slate-500">OR</span>

              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <OAuthButtons />
            <p className="mt-8 text-center text-sm text-slate-600">
              Already have an account?
              <Link
                to="/login"
                className="ml-2 font-semibold text-[#5A3825] hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
