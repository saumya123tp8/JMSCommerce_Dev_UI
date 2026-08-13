/* ===========================
   Request DTOs
=========================== */

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordFormData {
  email: string;
  answer: string;
  newPassword: string;
}

/* ===========================
   Generic API Response
=========================== */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  error: string | null;
  timestamp: string;
  path: string;
}

/* ===========================
   User DTO
=========================== */

export interface UserDto {
  id: string;
  name: string;
  email: string;
  image: string;
  provider: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

/* ===========================
   Login Response DTO
=========================== */

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  userDto: UserDto;
}

/* ===========================
   Redux Auth State
=========================== */

export interface AuthState {
  isAuthenticated: boolean;
  user: UserDto | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

/* ===========================
   Other Redux States
=========================== */

export interface CounterState {
  value: number;
}


export interface renewAuthStore{
  accessToken : string;
  user: UserDto | null;
}