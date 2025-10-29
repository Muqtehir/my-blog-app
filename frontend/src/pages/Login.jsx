import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { setToken, isAuthenticated } from "../services/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/login", { email, password });
      const token = res.data.token;
      if (token) {
        setToken(token);
        navigate("/home");
      } else {
        setError("Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  // Redirect if already authenticated (useEffect to avoid redirect during render)
  useEffect(() => {
    if (isAuthenticated()) navigate("/home");
  }, [navigate]);

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            background: "#4B0082",
            color: "white",
            border: "none",
          }}
        >
          Sign in
        </button>
      </form>
      <p style={{ marginTop: 12 }}>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
