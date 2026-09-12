import React from 'react';

// const API_URL = process.env.REACT_APP_API || '';
const OAUTH_API_URL = import.meta.env.VITE_OAUTH_API_BASE_URL || 'http://localhost:8080';
const OAuthButtons: React.FC = () => {
  const handleOAuth = (provider: 'google' | 'github') => {
    // Redirect-based OAuth: backend (passport) handles the provider flow
    // then redirects back to /auth/callback?token=...&user=...
    window.location.href = `${OAUTH_API_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="mt-6">
      <div className="relative flex items-center">
        <div className="flex-grow border-t border-slate-200" />
        <span className="mx-3 flex-shrink text-xs font-medium uppercase tracking-wide text-slate-400">
          or continue with
        </span>
        <div className="flex-grow border-t border-slate-200" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleOAuth('google')}
          className="flex items-center cursor-pointer justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.82-.07-1.42-.22-2.05H12v3.91h6.5c-.13 1.06-.84 2.66-2.42 3.73l-.02.15 3.52 2.72.24.02c2.24-2.06 3.67-5.1 3.67-8.48z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.06 7.93-2.88l-3.78-2.92c-1.01.7-2.37 1.19-4.15 1.19-3.17 0-5.86-2.09-6.82-4.97l-.14.01-3.66 2.83-.05.14C3.34 21.3 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.18 14.42A7.16 7.16 0 0 1 4.8 12c0-.84.15-1.65.37-2.42L5.16 9.4 1.45 6.5l-.12.06A11.99 11.99 0 0 0 0 12c0 1.93.46 3.76 1.27 5.38l3.91-2.96z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c2.26 0 3.79.97 4.66 1.79l3.4-3.31C17.94 1.19 15.24 0 12 0 7.34 0 3.34 2.7 1.33 6.62l3.85 2.99C6.14 6.84 8.83 4.75 12 4.75z"
            />
          </svg>
          Google
        </button>

        <button
          type="button"
          onClick={() => handleOAuth('github')}
          className="flex items-center cursor-pointer justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#181717" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          GitHub
        </button>
      </div>
    </div>
  );
};

export default OAuthButtons;
