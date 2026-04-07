import axios from "axios";
import type { Client, ClientFormData } from "../types/client";

const API_URL = "http://localhost:3000/clients";

export const getClients = async (): Promise<Client[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createClient = async (client: ClientFormData): Promise<Client> => {
  const res = await axios.post(API_URL, client);
  return res.data;
};

export const updateClient = async (id: number, client: ClientFormData): Promise<Client> => {
  const res = await axios.put(`${API_URL}/${id}`, client);
  return res.data;
};

export const deleteClient = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};