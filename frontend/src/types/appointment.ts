export interface Appointment {
  id: number;
  date: string; // ISO string
  status: "PLANIFIE" | "TERMINE" | "ANNULE";
  comment?: string;
  clientId: number;
  userId: number;
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