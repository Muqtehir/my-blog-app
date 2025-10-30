import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    // Placeholder - in real app you'd call API
    alert(`Login submitted for ${email}`);
  };

  return (
    <main style={{ padding: 48 }}>
      <div style={{ maxWidth: 420, margin: "0 auto", color: "#fff" }}>
        <h1>Login</h1>
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
