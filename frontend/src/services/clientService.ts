import api from '../api/client';
import type { Client } from '../types/client';

export const getClients = async (): Promise<Client[]> => {
  const response = await api.get('/clients');
  return response.data;
};