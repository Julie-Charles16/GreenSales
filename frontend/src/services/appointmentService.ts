import api from "../api/client";
import type { Appointment, AppointmentFormData } from "../types/appointment";

const API_URL = "/appointments";

export const getAppointments = async (): Promise<Appointment[]> => {
  const res = await api.get(API_URL);
  return res.data;
};

export const createAppointment = async (
  appointment: AppointmentFormData
): Promise<Appointment> => {
  const res = await api.post(API_URL, appointment);
  return res.data;
};

export const updateAppointment = async (
  id: number,
  appointment: AppointmentFormData
): Promise<Appointment> => {
  const res = await api.put(`${API_URL}/${id}`, appointment);
  return res.data;
};

export const deleteAppointment = async (id: number): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};