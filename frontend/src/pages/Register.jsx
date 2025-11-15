import { useState } from "react";
import { registerUser } from "../services/api";
import AuthButton from "../components/AuthButton";
import { motion } from "framer-motion";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await registerUser(form);
    if (res?.token) {
      localStorage.setItem("token", res.token);
      setMessage("Registration successful!");
      window.location.href = "/dashboard";
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
        color: "white",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
          textAlign: "center",
          color: "#333",
          width: "350px",
        }}
      >
        <h2 style={{ marginBottom: "1.5rem" }}>Create Your Account</h2>

        {/* Social buttons */}
        <AuthButton
          provider="google"
          onClick={() => alert("Google login coming soon")}
        />
        <AuthButton
          provider="apple"
          onClick={() => alert("Apple login coming soon")}
        />
        <AuthButton
          provider="email"
          onClick={() => alert("Email registration coming soon")}
        />

        <p style={{ margin: "1rem 0", fontWeight: "bold" }}>OR</p>

        {/* Registration Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{
              padding: "0.6rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{
              padding: "0.6rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{
              padding: "0.6rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
            required
          />
          <button
            type="submit"
            style={{
              padding: "0.6rem",
              borderRadius: "8px",
              border: "none",
              background: "#6a0dad",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "1rem", color: "red" }}>{message}</p>
        )}

        <p style={{ marginTop: "1rem" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#6a0dad" }}>
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
}
