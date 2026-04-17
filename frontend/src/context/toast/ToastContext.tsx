import { createContext } from "react";

type Toast = {
  message: string;
  variant?: "success" | "danger" | "warning" | "info";
};

export type ToastContextType = {
  showToast: (toast: Toast) => void;
};

export const ToastContext = createContext<ToastContextType | null>(null);