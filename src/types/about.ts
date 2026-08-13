export interface Pillar {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface TeamMember {
  id: number;
  initials: string;
  name: string;
  role: string;
}

export type StoreStatus = "open" | "closed" | "soon";

export interface Store {
  id: string;
  name: string;
  area: string;
  address: string;
  hours: string;
  phone: string;
  status: StoreStatus;
  tags: string[];
}