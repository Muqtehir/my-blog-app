import { NavLink } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token"); // check if user is logged in

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        background: "linear-gradient(90deg, #6a0dad, #1e90ff, #ff4500)",
        color: "white",
        fontWeight: "bold",
      }}
    >
      <div className="logo">
        <NavLink to="/" style={{ color: "white", textDecoration: "none" }}>
          My Blog
        </NavLink>
      </div>

      <ul
        style={{
          display: "flex",
          listStyle: "none",
          gap: "1.5rem",
          alignItems: "center",
        }}
      >
        <li>
          <NavLink
            to="/"
            end
            style={({ isActive }) => ({
              color: isActive ? "yellow" : "white",
              borderBottom: isActive ? "2px solid yellow" : "none",
            })}
          >
            Home
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/create"
            style={({ isActive }) => ({
              color: isActive ? "yellow" : "white",
              borderBottom: isActive ? "2px solid yellow" : "none",
            })}
          >
            Create Blog
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/posts"
            style={({ isActive }) => ({
              color: isActive ? "yellow" : "white",
              borderBottom: isActive ? "2px solid yellow" : "none",
            })}
          >
            Posts
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/about"
            style={({ isActive }) => ({
              color: isActive ? "yellow" : "white",
              borderBottom: isActive ? "2px solid yellow" : "none",
            })}
          >
            About
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/contact"
            style={({ isActive }) => ({
              color: isActive ? "yellow" : "white",
              borderBottom: isActive ? "2px solid yellow" : "none",
            })}
          >
            Contact
          </NavLink>
        </li>

        {/* ✅ SHOW PROFILE ONLY WHEN LOGGED IN */}
        {token && (
          <li>
            <NavLink
              to="/profile"
              style={({ isActive }) => ({
                color: isActive ? "yellow" : "white",
                borderBottom: isActive ? "2px solid yellow" : "none",
              })}
            >
              Profile
            </NavLink>
          </li>
        )}

        {/* Login / Logout System */}
        {!token ? (
          <>
            <li>
              <NavLink
                to="/login"
                style={({ isActive }) => ({
                  color: isActive ? "yellow" : "white",
                  borderBottom: isActive ? "2px solid yellow" : "none",
                })}
              >
                Login
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/signup"
                style={({ isActive }) => ({
                  color: isActive ? "yellow" : "white",
                  borderBottom: isActive ? "2px solid yellow" : "none",
                })}
              >
                Sign Up
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "1px solid white",
                borderRadius: "5px",
                color: "white",
                padding: "0.3rem 0.6rem",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
