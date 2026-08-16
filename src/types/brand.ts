export interface Brand {
  id: number;
  name: string;
  stablishDate: string | null; // ISO date string, field name kept as-is per API (see doc TODO on renaming)
  description: string | null;
  logo: string | null;
}

export type BrandPayload = Omit<Brand, "id">;