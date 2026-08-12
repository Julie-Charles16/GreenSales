import type { Role } from "./user";

export type SaleStatus = "EN_ATTENTE" | "ANNULEE" | "TERMINEE";

export interface Sale {
  id: number;
  amount: number;
  status: SaleStatus;
  commission: number;
  signedAt: string;
  clientId: number;
  userId: number;

  user?: {
    id: number;
    pseudo: string;
    role: Role;
  };

  client?: {
    id: number;
    name: string;
    firstName: string;
  };
}

export interface SaleFormData {
  amount: number;
  status: SaleStatus;
  clientId: number;
}