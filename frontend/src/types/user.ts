export type Role = "ADMIN" | "MANAGER" | "COMMERCIAL";

export interface User {
  id: number;
  pseudo: string;
  email: string;
  role: Role;
}