import { useState } from "react";
import type { ReactNode } from "react";
import { ToastContext } from "./ToastContext";

type Toast = {
  message: string;
  variant?: "success" | "danger" | "warning" | "info";
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (newToast: Toast) => {
    setToast(newToast);

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div className="position-fixed top-0 start-50 translate-middle-x p-3" style={{ zIndex: 9999 }}>
          <div className={`toast show text-bg-${toast.variant || "success"}`}>
            <div className="d-flex">
              <div className="toast-body">{toast.message}</div>

              <button
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setToast(null)}
              ></button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};