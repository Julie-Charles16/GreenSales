import type { Role } from "./user";
export interface Appointment {
  id: number;
  date: string;
  status: "PLANIFIE" | "TERMINE" | "ANNULE";
  comment?: string;
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

export interface AppointmentFormData {
  date: string; // ISO string
  status: "PLANIFIE" | "TERMINE" | "ANNULE";
  comment?: string;
  clientId: number;
}