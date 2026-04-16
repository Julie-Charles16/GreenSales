import api from "../api/client";
import type { Sale, SaleFormData } from "../types/sale";

const API_URL = "/sales";

export const getSales = async (): Promise<Sale[]> => {
  const res = await api.get(API_URL);
  return res.data;
};

export const createSale = async (data: SaleFormData): Promise<Sale> => {
  const res = await api.post(API_URL, data);
  return res.data;
};

export const updateSale = async (id: number, data: SaleFormData): Promise<Sale> => {
  const res = await api.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteSale = async (id: number): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};