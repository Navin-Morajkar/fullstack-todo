import React from "react";
import "./AlertModal.css";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: React.ReactNode;
  type?: "danger" | "info";
  onConfirm?: () => void;
  confirmText?: string;
}

export const AlertModal = (props: AlertModalProps) => {
  const {
    isOpen,
    onClose,
    title,
    message,
    type = "info",
    onConfirm,
    confirmText = "Confirm",
  } = props;
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3
            className="modal-title"
            style={{ color: type === "danger" ? "#ef4444" : "#0f172a" }}>
            {title}
          </h3>
        </div>

        <div className="modal-body">{message}</div>

        <div className="modal-actions">
          {/* If there is a confirm action, show a Cancel button */}
          {onConfirm && (
            <button
              onClick={onClose}
              style={{
                background: "white",
                border: "1px solid #cbd5e1",
                color: "#64748b",
              }}>
              Cancel
            </button>
          )}

          <button
            className={type === "danger" ? "btn-delete" : "btn-primary"}
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
            style={{ width: "auto" }}>
            {onConfirm ? confirmText : "OK, Got it"}
          </button>
        </div>
      </div>
    </div>
  );
};
