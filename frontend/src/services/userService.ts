import api from "../api/client";

export const updateUser = async (data: {
  pseudo: string;
  email: string;
}) => {
  const response = await api.put("/api/user/update", data);
  return response.data;
};

export const updatePassword = async (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  const response = await api.put("/api/user/password", data);
  return response.data;
};

export const deleteAccount = async (data: { password: string }) => {
  const response = await api.delete("/api/user/delete", {
    data,
  });
  return response.data;
};