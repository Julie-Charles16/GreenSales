import api from "../api/client";
import type { Client, ClientFormData } from "../types/client";

const API_URL = "/clients";

export const getClients = async (): Promise<Client[]> => {
  const res = await api.get(API_URL);
  return res.data;
};

export const createClient = async (client: ClientFormData): Promise<Client> => {
  const res = await api.post(API_URL, client);
  return res.data;
};

export const updateClient = async (id: number, client: ClientFormData): Promise<Client> => {
  const res = await api.put(`${API_URL}/${id}`, client);
  return res.data;
};

export const deleteClient = async (id: number): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};