import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { ToastContext } from "./ToastContext";
import { createPortal } from "react-dom";

type Toast = {
  message: string;
  variant?: "success" | "danger" | "warning" | "info";
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<Toast | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const showToast = (newToast: Toast) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToast(newToast);

    timeoutRef.current = window.setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast &&
        createPortal(
          <div className="position-fixed top-0 start-50 translate-middle-x p-3" style={{ zIndex: 9999 }}>
            <div className={`toast show text-bg-${toast.variant || "success"}`}>
              <div className="toast-body">{toast.message}</div>
            </div>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};