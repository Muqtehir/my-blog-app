import React, { useState, useRef } from "react";
import { useUser } from "../context/coreUserContext";
import "./Login.css";
import GoogleLogo from "../assets/google.svg";
import AppleLogo from "../assets/apple.svg";
import { supabase } from "../supabaseClient";

export default function Signup() {
  const { setUser } = useUser();
  const [name, setName] = useState("");
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
      const { data, error } = await supabase.auth.signUp(
        { email, password },
        { data: { full_name: name } }
      );
      if (error) throw error;

      if (data && data.user) {
        setUser(data.user);
        if (data.session) {
          try {
            localStorage.setItem("token", data.session.access_token);
          } catch (err) {
            // Ignore localStorage errors (e.g., storage disabled) but log for debugging
            // eslint-disable-next-line no-console
            console.warn("Failed to save auth token to localStorage:", err);
          }
          window.location.hash = "#/";
        } else {
          setError(
            "A confirmation email has been sent. Please check your inbox to complete registration."
          );
        }
      } else {
        setError(
          "Signup succeeded but no user returned. Check email for confirmation."
        );
      }
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin + "/#/" },
      });
      if (error) setError(error.message);
    } catch (err) {
      setError(err.message || "OAuth sign-up failed");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="brand">My Blog</div>
        <div className="tagline">Create your account</div>

        {error && (
          <div style={{ color: "#ffb3b3", marginBottom: 12 }}>{error}</div>
        )}

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
              ref={emailRef}
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

          <button type="submit" className="cta-button" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="social-group">
          <button
            type="button"
            className="social-button google"
            onClick={() => handleOAuth("google")}
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
          Already have an account? <a href="#/login">Sign in</a>
        </div>
      </div>
    </main>
  );
}
