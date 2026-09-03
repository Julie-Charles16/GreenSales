import type { Role } from "../types/user";

export const roleConfig: Record<
  Role,
  {
    label: string;
    color: string;
    icon: string;
  }
> = {
  COMMERCIAL: {
    label: "Commercial",
    color: "success",
    icon: "bi-person-badge-fill",
  },
  MANAGER: {
    label: "Manager",
    color: "info",
    icon: "bi-people-fill",
  },
  ADMIN: {
    label: "Administrateur",
    color: "warning",
    icon: "bi-shield-lock-fill",
  },
};