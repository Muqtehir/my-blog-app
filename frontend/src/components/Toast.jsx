import React, { useEffect } from "react";
import "./Toast.css";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        {type === "success" && <span className="toast-icon">✓</span>}
        {type === "error" && <span className="toast-icon">✕</span>}
        {type === "info" && <span className="toast-icon">ℹ</span>}
        <p>{message}</p>
      </div>
      <div className={`toast-progress toast-progress-${type}`}></div>
    </div>
  );
};

export default Toast;
