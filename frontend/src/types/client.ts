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
  createdAt?: string;
}

/** Le propriétaire et la date sont définis par le backend authentifié. */
export type ClientFormData = Omit<Client, "id" | "userId" | "createdAt">;
