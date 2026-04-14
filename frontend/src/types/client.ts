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
  createdAt?: string;
}

export type ClientFormData = Omit<Client, "id">;