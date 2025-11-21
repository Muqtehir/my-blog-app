import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import googleLogo from "../assets/google.webp";
import appleLogo from "../assets/apple.png";
import { loginUser } from "../services/api";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await loginUser(formData);
    if (res && res.token) {
      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    } else {
      setError(res?.message || "Invalid email or password");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && (
          <div
            style={{
              color: "#ff4d4f",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to continue your journey</p>

        {/* Email */}
        <div className="auth-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="auth-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit */}
        <button className="auth-btn" type="submit">
          Login
        </button>

        {/* OR Divider */}
        <div className="auth-divider">
          <span>OR</span>
        </div>

        {/* Social Buttons */}
        <div className="social-buttons">
          <button className="google-btn">
            <img src={googleLogo} alt="Google Logo" />
            Continue with Google
          </button>

          <button className="apple-btn">
            <img src={appleLogo} alt="Apple Logo" />
            Continue with Apple
          </button>
        </div>

        {/* Bottom Link */}
        <p className="auth-bottom-text">
          Don’t have an account?{" "}
          <Link to="/signup" className="auth-link">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
