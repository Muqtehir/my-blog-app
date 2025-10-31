import React, { useEffect, useState } from "react";

// Simple local toast system so the app works without external deps.
// Usage: import toast from './components/Toast'; toast.success('msg');
const listeners = new Set();

export function emitToast(t) {
  for (const l of listeners) l(t);
}

const toast = {
  success: (msg) => emitToast({ type: "success", msg }),
  error: (msg) => emitToast({ type: "error", msg }),
  info: (msg) => emitToast({ type: "info", msg }),
};

export default toast;

export function Toaster({ position = "top-right" } = {}) {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const sub = (t) => {
      const id = Date.now() + Math.random();
      setToasts((s) => [...s, { id, ...t }]);
      setTimeout(() => {
        setToasts((s) => s.filter((x) => x.id !== id));
      }, 3500);
    };
    listeners.add(sub);
    return () => listeners.delete(sub);
  }, []);

  const containerStyle = {
    position: "fixed",
    zIndex: 9999,
    right: position.includes("right") ? 16 : "auto",
    left: position.includes("left") ? 16 : "auto",
    top: position.includes("top") ? 16 : "auto",
    bottom: position.includes("bottom") ? 16 : "auto",
  };

  return (
    <div style={containerStyle}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            marginBottom: 8,
            padding: "10px 14px",
            borderRadius: 8,
            minWidth: 160,
            color: "#fff",
            background:
              t.type === "success"
                ? "#16a34a"
                : t.type === "error"
                ? "#dc2626"
                : "#2563eb",
            boxShadow: "0 8px 24px rgba(12,10,18,0.12)",
          }}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}
