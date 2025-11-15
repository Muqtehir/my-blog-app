import React from "react";

export default function AuthButton({ provider, onClick }) {
  let bgColor, textColor, logo;

  switch (provider) {
    case "google":
      bgColor = "#ffffff";
      textColor = "#000000";
      logo =
        "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg";
      break;
    case "apple":
      bgColor = "#000000";
      textColor = "#ffffff";
      logo =
        "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg";
      break;
    case "email":
      bgColor = "#6a0dad"; // purple
      textColor = "#ffffff";
      logo =
        "https://upload.wikimedia.org/wikipedia/commons/4/4e/Mail_%28iOS%29.svg";
      break;
    default:
      bgColor = "#ccc";
      textColor = "#000";
  }

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        backgroundColor: bgColor,
        color: textColor,
        border: "none",
        borderRadius: "8px",
        padding: "0.6rem 1rem",
        cursor: "pointer",
        fontWeight: "bold",
        width: "250px",
        marginBottom: "1rem",
        boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
      }}
    >
      <img
        src={logo}
        alt={provider}
        style={{ width: "20px", height: "20px" }}
      />
      Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}
    </button>
  );
}
