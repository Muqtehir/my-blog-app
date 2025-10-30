import React, { useState } from "react";
import { apiPost, apiGet } from "../services/api";
import { useUser } from "../context/coreUserContext";

export default function Login() {
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await apiPost("/users/login", { email, password });
      if (data && data.token) {
        localStorage.setItem("token", data.token);
        // fetch and set user in context
        try {
          const me = await apiGet("/users/me");
          if (me && me.user) setUser(me.user);
        } catch {
          // ignore — provider will handle
        }
      } else {
        throw new Error(
          data && data.message ? data.message : "Invalid login response"
        );
      }
      window.location.hash = "#/";
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <main style={{ padding: 48 }}>
      <div
        style={{ maxWidth: 420, margin: "0 auto", color: "var(--text-gray)" }}
      >
        <h1>Login</h1>
        {error && (
          <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>
        )}
        <form onSubmit={onSubmit} className="auth-form">
          <label>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </label>
          <label>
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </label>
          <button type="submit" className="cta-button">
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
