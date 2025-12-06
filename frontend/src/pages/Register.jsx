import { useState } from "react";
import { motion } from "framer-motion";
import { registerUser } from "../services/api";

// Social Icons
import googleLogo from "../assets/google.webp";
import appleLogo from "../assets/apple.png";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // -----------------------------
  // VALIDATION HELPERS
  // -----------------------------
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);

  const validateForm = () => {
    const newErrors = {};

    if (!form.username.trim()) newErrors.username = "Username is required";
    else if (form.username.trim().length < 5)
      newErrors.username = "Username must be at least 5 characters";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(form.email))
      newErrors.email = "Invalid email format";

    if (!form.password) newErrors.password = "Password is required";
    else if (!validatePassword(form.password))
      newErrors.password =
        "Password must be 6+ chars, include 1 uppercase & 1 number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -----------------------------
  // SUBMIT FORM
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    const res = await registerUser(form);

    if (res?.token) {
      localStorage.setItem("token", res.token);
      window.location.href = "/posts";
    } else {
      setMessage(res?.message || "Error registering user");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #6a0dad, #1e90ff, #ff4500)",
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          width: "360px",
          background: "white",
          padding: "2rem",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 5px 20px rgba(0,0,0,0.25)",
        }}
      >
        <h2 style={{ marginBottom: "1.5rem" }}>Create Your Account</h2>

        {/* ----------------------------- */}
        {/* SOCIAL LOGIN BUTTONS */}
        {/* ----------------------------- */}
        <button className="oauth-btn google">
          <img src={googleLogo} alt="Google" className="oauth-icon" />
          Continue with Google
        </button>

        <button className="oauth-btn apple">
          <img src={appleLogo} alt="Apple" className="oauth-icon" />
          Continue with Apple
        </button>

        <p style={{ margin: "1rem 0", fontWeight: "bold", color: "#444" }}>
          OR
        </p>

        {/* ----------------------------- */}
        {/* FORM */}
        {/* ----------------------------- */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {/* Full Name */}
          <div>
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => {
                setForm({ ...form, username: e.target.value });
                if (errors.username) setErrors({ ...errors, username: "" });
              }}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                borderRadius: "8px",
                border: errors.username ? "1px solid red" : "1px solid #ccc",
              }}
            />
            {errors.username && (
              <p style={{ color: "red", fontSize: "0.8rem" }}>
                {errors.username}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                borderRadius: "8px",
                border: errors.email ? "1px solid red" : "1px solid #ccc",
              }}
            />
            {errors.email && (
              <p style={{ color: "red", fontSize: "0.8rem" }}>{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                borderRadius: "8px",
                border: errors.password ? "1px solid red" : "1px solid #ccc",
              }}
            />
            {errors.password && (
              <p style={{ color: "red", fontSize: "0.8rem" }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            style={{
              padding: "12px",
              background: "#6a0dad",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>
        </form>

        {/* Status Message */}
        {message && (
          <p style={{ marginTop: "1rem", color: "red" }}>{message}</p>
        )}

        {/* Login Link */}
        <p style={{ marginTop: "1rem", color: "#444" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#6a0dad", fontWeight: "bold" }}>
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
}
