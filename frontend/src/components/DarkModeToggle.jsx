import React, { useEffect, useState } from "react";
import "./DarkModeToggle.css";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // apply dark mode to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="dark-toggle-container">
      <div
        className={`toggle-switch ${darkMode ? "active" : ""}`}
        onClick={() => setDarkMode(!darkMode)}
      >
        <div className="switch-circle"></div>
      </div>
    </div>
  );
};

export default DarkModeToggle;
