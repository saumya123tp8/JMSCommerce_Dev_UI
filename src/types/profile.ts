export interface UserRole { name: string }

export interface UserProfile {
  email: string;
  name: string;
  image: string | null;
  phone: string;
  age: number | null;
  provider: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  roles: UserRole[];
}

export interface UpdateProfilePayload {
  name: string;
  phone: string;
  age: number | null;
  image?: string | null;
}

export type VerificationType = "EMAIL" | "PHONE";