import React from "react";

interface Props {
  message: string;
  onClose: () => void;
  variant?: "success" | "danger" | "warning" | "info";
}

const ToastMessage: React.FC<Props> = ({
  message,
  onClose,
  variant = "success",
}) => {
  if (!message) return null; // 👈 important

  return (
    <div
      className="position-fixed top-0 end-0 p-3"
      style={{ zIndex: 9999 }}
    >
      <div
        className={`toast align-items-center text-bg-${variant} show`}
        role="alert"
      >
        <div className="d-flex">
          <div className="toast-body">{message}</div>

          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default ToastMessage;