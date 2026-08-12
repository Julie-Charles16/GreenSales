import type { Role } from "./user";
export interface Client {
  id: number;
  name: string;
  firstName: string;
  address: string;
  city: string;
  postalCode: string;
  email: string;
  phone?: string;
  projectType: string;
  status: string;
  userId: number;

  user?: {
    id: number;
    pseudo: string;
    role: Role;
  };

  createdAt?: string;
}

/** Le propriétaire et la date sont définis par le backend authentifié. */
export type ClientFormData = Omit<Client, "id" | "userId" | "createdAt">;
