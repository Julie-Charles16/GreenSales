export type Role = "ADMIN" | "MANAGER" | "COMMERCIAL";

export interface User {
  id: number;
  pseudo: string;
  email: string;
  role: Role;
  manager?: {
    id: number;
    pseudo: string;
    role: Role;
  } | null;
}

export interface AdminUser extends User {
  createdAt?: string;
  managerId: number | null;
}