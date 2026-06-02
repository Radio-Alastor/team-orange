import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { getUser, clearAuth } from "../lib/auth";
import ProfileModal from "./ProfileModal";

export default function Navbar() {
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setUser(getUser());
  }, [location]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // best-effort
    }
    clearAuth();
    window.location.href = "/";
  }

  return (
    <>
      <nav className="navbar sticky-top navbar-expand-md navbar-light border-bottom" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <Link className="me-3" to="/">
            <img src="/imgs/logo.svg" width={60} height={60} className="d-inline-block align-text-top" alt="SilverGuide Logo" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMain"
            aria-controls="navbarMain"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarMain">
            <ul className="navbar-nav align-items-center mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  to="/"
                  end
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  to="/articles"
                >
                  Learn
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  to="/about"
                >
                  About
                </NavLink>
              </li>
              {user?.staff && (
                <>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                      to="/editor"
                    >
                      Editor
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                      to="/admin"
                    >
                      Admin
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
            <div className="d-flex align-items-center gap-2">
              <Link className="text-danger fw-bold me-3 text-decoration-none" to="/emergency">
                🚨 Help-Line
              </Link>
              {user ? (
                <>
                  <button
                    className="btn btn-link p-0"
                    title="Profile"
                    onClick={() => setShowProfile(true)}
                  >
                    <i className="bi bi-person-circle fs-4" />
                  </button>
                  <button className="btn btn-outline-secondary" onClick={handleLogout}>
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link className="btn btn-outline-primary" to="/login">Sign In</Link>
                  <Link className="btn btn-primary" to="/register">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  );
}
