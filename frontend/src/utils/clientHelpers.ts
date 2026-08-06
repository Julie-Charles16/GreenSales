import type { Client } from "../types/client";

export const getClientName = (
  clients: Client[],
  clientId: number
): string => {
  const client = clients.find((c) => c.id === clientId);

  return client
    ? `${client.name} ${client.firstName}`
    : "Client inconnu";
};

export const getClientProjectType = (
  clients: Client[],
  clientId: number
): string => {
  const client = clients.find((c) => c.id === clientId);

  return client?.projectType ?? "Non défini";
};

export const getClientAddress = (
  clients: Client[],
  clientId: number
): string => {
  const client = clients.find((c) => c.id === clientId);

  return client
    ? `${client.address}, ${client.city}`
    : "Non défini";
};