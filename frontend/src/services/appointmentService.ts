import axios from "axios";
import type { Appointment, AppointmentFormData } from "../types/appointment";

const API_URL = "http://localhost:3000/appointments";

export const getAppointments = async (): Promise<Appointment[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createAppointment = async (
  appointment: AppointmentFormData
): Promise<Appointment> => {
  const res = await axios.post(API_URL, appointment);
  return res.data;
};

export const updateAppointment = async (
  id: number,
  appointment: AppointmentFormData
): Promise<Appointment> => {
  const res = await axios.put(`${API_URL}/${id}`, appointment);
  return res.data;
};

export const deleteAppointment = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};