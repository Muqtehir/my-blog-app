import React, { useState, useRef } from "react";
import { useUser } from "../context/coreUserContext";
import "./Login.css";
import GoogleLogo from "../assets/google.svg";
import AppleLogo from "../assets/apple.svg";
import { supabase } from "../supabaseClient";

export default function Login() {
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      if (data && data.session) {
        try {
          localStorage.setItem("token", data.session.access_token);
        } catch (err) {
          // Ignore localStorage errors (e.g. storage disabled in some browsers),
          // but log a warning for debugging purposes.
          // eslint-disable-next-line no-console
          console.warn("Could not save access token to localStorage:", err);
        }
        if (data.user) setUser(data.user);
        window.location.hash = "#/";
      } else {
        setError("Signed in but no session returned");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    setError(null);
    try {
      // adjust redirectTo as needed
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin + "/#/" },
      });
      if (error) setError(error.message);
    } catch (err) {
      setError(err.message || "OAuth sign-in failed");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="brand">My Blog</div>
        <div className="tagline">Sign in to your account</div>

        {error && (
          <div style={{ color: "#ffb3b3", marginBottom: 12 }}>{error}</div>
        )}

        <form onSubmit={onSubmit} className="auth-form">
          <label>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              required
              ref={emailRef}
            />
          </label>

          <label>
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              required
            />
          </label>

          <button type="submit" className="cta-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="social-group">
          <button
            type="button"
            className="social-button google"
            onClick={() => handleOAuth("google")}
            aria-label="Continue with Google"
          >
            <span className="icon" aria-hidden>
              <img src={GoogleLogo} alt="Google" />
            </span>
            Continue with Google
          </button>

          <button
            type="button"
            className="social-button apple"
            onClick={() => handleOAuth("apple")}
            aria-label="Continue with Apple"
          >
            <span className="icon" aria-hidden>
              <img src={AppleLogo} alt="Apple" />
            </span>
            Continue with Apple
          </button>

          <button
            type="button"
            className="social-button email"
            onClick={() => emailRef.current && emailRef.current.focus()}
            aria-label="Continue with Email"
          >
            <span className="icon" aria-hidden>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                  fill="#111"
                />
              </svg>
            </span>
            Continue with Email
          </button>
        </div>

        <div className="auth-footer">
          Don't have an account? <a href="#/signup">Create one</a>
        </div>
      </div>
    </main>
  );
}
