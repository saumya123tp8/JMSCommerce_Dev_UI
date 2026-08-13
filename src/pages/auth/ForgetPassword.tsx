import React, { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout/Layout';
// import { ApiAuthResponse } from '../../types/auth.types';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
    //   const res = await axios.post<ApiAuthResponse>(`/api/v1/auth/forgot-password`, {
    //     email,
    //     answer,
    //     newPassword,
    //   });

    //   if (res && res.data.success) {
    //     toast.success(res.data.message || 'Password reset successfully');
    //     navigate('/login');
    //   } else {
    //     toast.error(res.data.message || 'Something went wrong');
    //   }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Forgot Password">
      <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-[#F8F7FF] px-4 py-12">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 animate-pulse rounded-full bg-indigo-300/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 animate-pulse rounded-full bg-violet-300/40 blur-3xl [animation-delay:1s]" />

        <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-8 shadow-xl sm:p-10">
          <h1 className="font-[Poppins,sans-serif] text-2xl font-semibold text-slate-900">
            Reset your password
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Confirm your email and security answer to set a new password.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="fp-email" className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="fp-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            <div>
              <label htmlFor="fp-answer" className="mb-1 block text-sm font-medium text-slate-700">
                Favorite sport
              </label>
              <input
                id="fp-answer"
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Your security answer"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            <div>
              <label htmlFor="new-password" className="mb-1 block text-sm font-medium text-slate-700">
                New password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Resetting…' : 'Reset password'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Remembered it after all?{' '}
            <Link to="/login" className="font-semibold text-indigo-600">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
