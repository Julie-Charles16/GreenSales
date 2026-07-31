import api from "../api/client";
import type { AdminUser, Role } from "../types/user";

const API_URL = "/admin/users";

export const getUsers = async (): Promise<AdminUser[]> =>
  (await api.get(API_URL)).data;

export const updateManagedUserRole = async (
  id: number,
  role: Role
): Promise<AdminUser> => {
  const response = await api.patch(`${API_URL}/${id}/role`, { role });
  return response.data.user;
};

export const updateManagedUserManager = async (
  id: number,
  managerId: number | null
): Promise<AdminUser> => {
  const response = await api.patch(`${API_URL}/${id}/manager`, {
    managerId,
  });

  return response.data.user;
};

export const deleteManagedUser = async (
  id: number
): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};