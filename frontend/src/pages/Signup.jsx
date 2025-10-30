import React, { useState } from "react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    alert(`Signup submitted for ${name} <${email}>`);
  };

  return (
    <main style={{ padding: 48 }}>
      <div style={{ maxWidth: 480, margin: "0 auto", color: "#fff" }}>
        <h1>Signup</h1>
        <form onSubmit={onSubmit} className="auth-form">
          <label>
            Full name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
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
            Create account
          </button>
        </form>
      </div>
    </main>
  );
}
