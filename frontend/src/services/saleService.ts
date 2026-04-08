import axios from "axios";
import type { Sale, SaleFormData } from "../types/sale";

const API_URL = "http://localhost:3000/sales";

export const getSales = async (): Promise<Sale[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createSale = async (data: SaleFormData): Promise<Sale> => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updateSale = async (id: number, data: SaleFormData): Promise<Sale> => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteSale = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};