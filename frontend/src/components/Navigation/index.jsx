import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, removeToken } from "../../services/auth";

function NavigationBar() {
  const navigate = useNavigate();
  const authed = isAuthenticated();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    removeToken();
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div
        className="app-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>My Blog</h1>
        <div className="links">
          {authed ? (
            <>
              <Link to="/home">Home</Link>
              <Link
                to="/create"
                className="btn-gradient"
                style={{ padding: "8px 12px" }}
              >
                New Post
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--deep-purple)",
                  fontWeight: 600,
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/">Login</Link>
              <Link to="/signup">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
